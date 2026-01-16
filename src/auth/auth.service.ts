import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigService, ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import {} from //   INVALID_REFRESH_TOKEN,
//   INVALID_RESET_TOKEN,
//   RESET_TOKEN_EXPIRED,
//   USER_NOT_FOUND,
'../common/constants';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { genSalt, hash } from 'bcryptjs';
import { compare } from 'bcryptjs';
import { Role } from '../role/entities/role.entity';
import * as argon2 from 'argon2';
import { AuthJwtPayload } from './types/auth.jwtPayload';
import { Response } from 'express';
import {
  INCORRECT_PASSWORD_OR_EMAIL,
  INVALID_REFRESH_TOKEN,
  INVALID_RESET_TOKEN,
  RESET_TOKEN_EXPIRED,
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
} from './constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private mailerService: MailerService,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    const isPasswordMatch = await compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      throw new UnauthorizedException(INCORRECT_PASSWORD_OR_EMAIL);
    }

    return { id: user.id, roles: user.roles };
  }

  async register(createAuthDto: CreateAuthDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        email: createAuthDto.email,
      },
    });

    if (findUser) {
      throw new BadRequestException(USER_ALREADY_EXIST);
    }

    // для засiювання ролi адмiна. В iнших випадках буде { "id": "123" }
    // if(createAuthDto.roles && createAuthDto.roles[0]?.slug) {
    // 	const role = await this.roleRepository.findOne({ where: { slug: createAuthDto.roles[0]?.slug }})
    // 	const { roles, ...tailUserDto } = createAuthDto;

    // 	const user = await this.userService.create({ ...tailUserDto, roles: [{ id: role.id }]});
    // 	await this.userRepository.save(user);
    // 	return;
    // }

    const user = await this.userService.create(createAuthDto);
    await this.userRepository.save(user);
    return await this.login({ id: user.id, roles: user.roles });
  }

  async findUserByEmailByAdmin(email: string) {
    return this.userService.findByEmail(email);
  }

  async login({ id, roles }: { id: string; roles: Role[] }) {
    const { access_token, refresh_token } = await this.generateTokens({
      id,
      roles,
    });

    await this.userService.updateHashedRefreshToken(id, refresh_token);
    return { access_token, refresh_token };
  }

  async createPasswordResetRequest(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.userRepository.update(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Скидання пароля',
        html: `Для скидання пароля перейдiть за посиланням: <a href="${resetUrl}">${resetUrl}</a>`,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resetUserPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      throw new NotFoundException(INVALID_RESET_TOKEN);
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      await this.userRepository.update(user.id, {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      throw new BadRequestException(RESET_TOKEN_EXPIRED);
    }

    const salt = await genSalt(10);
    const newPasswordHash = await hash(newPassword, salt);

    await this.userRepository.update(user.id, {
      passwordHash: newPasswordHash,
      resetPasswordExpires: null,
      resetPasswordToken: null,
    });
  }

  async generateTokens(user: {
    id: string;
    roles: Role[];
  }): Promise<{ access_token: string; refresh_token: string }> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync<AuthJwtPayload>({
        id: user.id,
        roles: user.roles,
      }),
      this.jwtService.signAsync<{ id: string }>(
        { id: user.id },
        this.refreshTokenConfig,
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async validateGoogleUser(googleUser: any) {
    const user = await this.userService.findByEmail(googleUser.email);

    if (user) {
      return user;
    }
    return await this.userService.create(googleUser);
  }

  async refresh(id: string, roles: Role[]) {
    const { access_token, refresh_token } = await this.generateTokens({
      id,
      roles,
    });

    await this.userService.updateHashedRefreshToken(id, refresh_token);
    return { access_token, refresh_token };
  }

  async validateRefreshToken({
    userId,
    refreshToken,
  }: {
    userId: string;
    refreshToken: string;
  }) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles'],
    });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }
    return { id: user.id, roles: user.roles };
  }

  async signOut(userId: string) {
    await this.userRepository.update(userId, {
      hashedRefreshToken: null,
    });
  }

  addTokensToResponseCookies({
    access_token,
    refresh_token,
    res,
  }: {
    access_token: string;
    refresh_token: string;
    res: Response;
  }) {
    const ACCESS_TOKEN_EXPIRATION = 900; // 15 хвилин
    const REFRESH_TOKEN_EXPIRATION = 14 * 24 * 3600; // 14 днiв

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true, // process.env.NODE_ENV === 'production' Только HTTPS в продакшене или true
      sameSite: 'none',
      //   secure: false,
      //   sameSite: 'lax', // в production вернуть проверитьи возможно none
      maxAge: ACCESS_TOKEN_EXPIRATION * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true, // process.env.NODE_ENV === 'production' Только HTTPS в продакшене или true
      sameSite: 'none',
      //   secure: false,
      //   sameSite: 'lax', // в production вернуть проверитьи возможно none
      maxAge: REFRESH_TOKEN_EXPIRATION * 1000,
    });
  }
}
