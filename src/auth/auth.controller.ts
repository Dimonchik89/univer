import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
// import { FORGOT_PASSWORD_MESSAGE, INVALID_REFRESH_TOKEN, INVALID_RESET_TOKEN, PASSWORD_RESET_SUCCESS, RESET_TOKEN_EXPIRED, SIGNOUT_SUCCESS_MESSAGE, USER_ALREADY_EXIST, USER_NOT_FOUND } from '../utils/constants';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { ConfigService } from '@nestjs/config';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/hwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import * as swaggerConstants from '../common/swagger-constants';
import { Response } from 'express';
import {
  FORGOT_PASSWORD_MESSAGE,
  INVALID_REFRESH_TOKEN,
  PASSWORD_RESET_SUCCESS,
  SIGNOUT_SUCCESS_MESSAGE,
} from './constants/auth.constants';
import * as swaggerAuthConstants from './constants/swagger.auth';
import { RolesGuard } from './guards/roles/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { SystemRoleSlug } from '../role/enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  // --------------------------- REGISTER -------------------------------
  @ApiOperation({ summary: swaggerAuthConstants.USER_REGISTRATION })
  @ApiBody({
    // type: CreateAuthDto,
    schema: {
      example: swaggerAuthConstants.EMAIL_PASSWORD_EXAMPLE,
    },
  })
  @ApiResponse({
    status: 201,
    description: swaggerAuthConstants.REGISTRATION_SUCCESSFULLY_MESSAGE,
    schema: {
      example: swaggerAuthConstants.TOKENS_EXAMPLE,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          [swaggerAuthConstants.USER_ALREADY_EXIST_MESSAGE]: {
            summary: swaggerAuthConstants.USER_ALREADY_EXIST_MESSAGE,
            value: swaggerAuthConstants.USER_ALREADY_EXIST_EXAMPLE,
          },
          [swaggerConstants.PROPERTY_SHOULD_NOT_EXIST]: {
            summary: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
            value: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
          },
        },
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('register')
  async register(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // return await this.authService.register(createAuthDto);

    const { access_token, refresh_token } =
      await this.authService.register(createAuthDto);

    this.authService.addTokensToResponseCookies({
      access_token,
      refresh_token,
      res,
    });
    return { message: 'Success' };
  }

  // -------------------------- Create user by admin -!!!!!!!!!!!!!!!!!!!!!!!!!1

  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('create-by-admin')
  async createByAdmin(@Body() createAuthDto: CreateAuthDto) {
    await this.authService.register(createAuthDto);

    return await this.authService.findUserByEmailByAdmin(createAuthDto.email);
  }

  // ------------------------------------------

  // --------------------------- Login -------------------------------
  @ApiOperation({ summary: swaggerAuthConstants.USER_AUTHORIZATION })
  @ApiBody({
    // type: CreateAuthDto,
    schema: {
      example: swaggerAuthConstants.EMAIL_PASSWORD_EXAMPLE,
    },
  })
  @ApiResponse({
    status: 200,
    description: swaggerAuthConstants.AUTHORIZATION_SUCCESSFUL_MESSAGE,
    schema: {
      example: swaggerAuthConstants.TOKENS_EXAMPLE,
    },
  })
  @ApiResponse({
    status: 400,
    description: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
    schema: {
      example: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
    },
  })
  @ApiResponse({
    status: 401,
    description: swaggerAuthConstants.INCORRECT_EMAIL_OR_PASSWORD_MESSAGE,
    schema: {
      example: swaggerAuthConstants.INCORRECT_EMAIL_OR_PASSWORD_EXAMPLE,
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    // return await this.authService.login({ id: req.user.id, roles: req.user.roles });

    const { access_token, refresh_token } = await this.authService.login({
      id: req.user.id,
      roles: req.user.roles,
    });

    this.authService.addTokensToResponseCookies({
      access_token,
      refresh_token,
      res,
    });

    // при входе, регистрации, входя по гуглу и обновлении токена отправлять масив ролей пользователя для того чтоб сразу на клиенте сохранить и делать меньше запросов
    return { message: 'Success' };
  }

  // --------------------------- Refresh -------------------------------
  @ApiCookieAuth('refresh_token')
  @ApiOperation({ summary: swaggerAuthConstants.UPDATE_TOKENS })
  @ApiResponse({
    status: 200,
    description: swaggerAuthConstants.GENERATE_TOKENS_MESSAGE,
    schema: {
      example: swaggerAuthConstants.TOKENS_EXAMPLE,
    },
  })
  @ApiResponse({
    status: 401,
    description: INVALID_REFRESH_TOKEN,
    schema: {
      example: swaggerConstants.INVALID_REFRESH_TOKEN_EXAMPLE,
    },
  })
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    // return await this.authService.refresh(req.user?.id, req.user?.roles);

    const { access_token, refresh_token } = await this.authService.refresh(
      req.user?.id,
      req.user?.roles,
    );

    this.authService.addTokensToResponseCookies({
      access_token,
      refresh_token,
      res,
    });

    return { message: 'Success' };
  }

  // ------------------------ Forgot Password -------------------------------
  @ApiOperation({
    summary: swaggerAuthConstants.PASSWORD_RESET,
  })
  @ApiBody({
    type: ForgotPasswordDto,
    examples: {
      example: {
        summary: swaggerConstants.EXAMPLE_REQUEST,
        value: ForgotPasswordDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: swaggerAuthConstants.FORGOT_PASSWORD_SUCCESS_MESSAGE,
    schema: {
      example: swaggerAuthConstants.FORGOT_PASSWORD_SUCCESS_EXAMPLE,
    },
  })
  @ApiResponse({
    status: 400,
    description: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
    schema: {
      example: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
    },
  })
  @ApiResponse({
    status: 401,
    description: swaggerAuthConstants.USER_NOT_FOUND_MESSAGE,
    schema: {
      example: swaggerAuthConstants.USER_NOT_FOUND_EXAMPLE,
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.createPasswordResetRequest(dto.email);

    return {
      message: FORGOT_PASSWORD_MESSAGE,
    };
  }

  // ------------------------ Reset Password -------------------------------
  @ApiOperation({
    summary: swaggerAuthConstants.RESET_PASSWORD_USING_TOKEN,
  })
  @ApiBody({
    type: ResetPasswordDto,
    examples: {
      example: {
        summary: 'Request example',
        value: ResetPasswordDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset',
    schema: {
      example: {
        message: PASSWORD_RESET_SUCCESS,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          refreshTokenExpired: {
            summary: 'Reset token has expired',
            value: swaggerAuthConstants.RESET_TOKEN_EXPIRED_EXAMPLE,
          },
          [swaggerConstants.PROPERTY_SHOULD_NOT_EXIST]: {
            summary: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
            value: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: swaggerAuthConstants.INCORRECT_EMAIL_OR_PASSWORD_MESSAGE,
    schema: {
      example: swaggerAuthConstants.INVALID_RESET_TOKEN_EXAMPLE,
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetUserPassword(dto.token, dto.newPassword);
    return { message: PASSWORD_RESET_SUCCESS };
  }

  // --------------------------- Google Auth -------------------------------
  @ApiOperation({
    summary: swaggerAuthConstants.GOOGLE_OAUTH_AUTHORIZATION,
    description: swaggerAuthConstants.GOOGLE_LOGIN_MESSAGE,
  })
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @ApiOperation({
    summary: swaggerAuthConstants.GOOGLE_OAUTH_CALLBACK,
    description: swaggerAuthConstants.GOOGLE_OAUTH_CALLBACK_MESSAGE,
  })
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    // const response = await this.authService.login({ id: req.user.id, roles: req.user.roles })

    // return res.redirect(`${this.configService.get("FRONTEND_URL")}?token=${response.access_token}`)

    const { access_token, refresh_token } = await this.authService.login({
      id: req.user.id,
      roles: req.user.roles,
    });

    this.authService.addTokensToResponseCookies({
      access_token,
      refresh_token,
      res,
    });

    return res.redirect(`${this.configService.get('FRONTEND_URL')}`);
  }

  // --------------------------- Sign Out -------------------------------
  // если loguot то удалять подписку из базы данных
  @ApiCookieAuth('access_token')
  @ApiOperation({
    summary: swaggerAuthConstants.SIGNOUT_MESSAGE,
  })
  @ApiResponse({
    status: 200,
    description: swaggerAuthConstants.SUCCESSFUL_LOGOUT_MESSAGE,
    schema: {
      example: swaggerAuthConstants.SIGNOUT_SUCCESSFUL_MESSAGE_EXAMPLE,
    },
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.INVALID_ACCESS_TOKEN,
    schema: {
      example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signout(@Req() req) {
    this.authService.signOut(req.user.id);
    return { message: SIGNOUT_SUCCESS_MESSAGE };
  }
}
