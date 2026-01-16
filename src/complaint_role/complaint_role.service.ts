import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComplaintRoleDto } from './dto/create-complaint-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ComplaintRole } from './entities/complaint_role.entity';
import { Repository } from 'typeorm';
import {
  COMPLAINT_ROLE_ALREADY_EXIST,
  COMPLAINT_ROLE_NOT_FOUND,
} from './constants/complaint_role.constants';
import { QueryDto } from '../user/dto/query.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateComplaintRole } from './dto/update-complaint-role.dto';
import { User } from '../user/entities/user.entity';
import { SendComplaintMessageDto } from './dto/send-complaint-message.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ComplaintRoleService {
  constructor(
    @InjectRepository(ComplaintRole)
    private complaintRoleRepository: Repository<ComplaintRole>,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async findOneByName(name: string) {
    return await this.complaintRoleRepository.findOne({ where: { name } });
  }

  async findById(id: string) {
    return await this.complaintRoleRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        id: true,
        name: true,
        slug: true,
        updatedAt: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    });
  }

  async create(dto: CreateComplaintRoleDto) {
    const normalizeName = dto.name.toLowerCase();
    const foundRole = await this.findOneByName(normalizeName);

    if (foundRole) {
      return new BadRequestException(COMPLAINT_ROLE_ALREADY_EXIST);
    }

    const complaintRole = await this.complaintRoleRepository.create({
      name: normalizeName,
      user: dto.user,
    });

    return await this.complaintRoleRepository.save(complaintRole);
  }

  async findAll(params: QueryDto) {
    const baseQuery =
      await this.complaintRoleRepository.createQueryBuilder('complaint_role');

    const limit =
      +params.limit || +this.configService.get('DEFAULT_PAGE_SIZE') || 10;
    const page = +params.page || 1;
    const skip = (page - 1) * limit;

    const totalQuery = await baseQuery.clone();
    const uniqueIdsResult = await totalQuery
      .select('complaint_role.id')
      .getMany();
    const totalCount = uniqueIdsResult.length;
    const results = await baseQuery
      .leftJoin('complaint_role.user', 'user')
      .addSelect(['user.id', 'user.email', 'user.firstName', 'user.lastName'])
      .limit(limit)
      .offset(skip)
      .getMany();

    return {
      results,
      total: totalCount,
      limit,
      page,
    };
  }

  async findOne(id: string) {
    const complaintRole = await this.findById(id);

    if (!complaintRole) {
      throw new BadRequestException(COMPLAINT_ROLE_NOT_FOUND);
    }
    return complaintRole;
  }

  async updateOne(dto: UpdateComplaintRole, id: string) {
    const complaintRole = await this.findById(id);

    if (!complaintRole) {
      throw new BadRequestException(COMPLAINT_ROLE_NOT_FOUND);
    }

    if (dto.name && dto.name.toLowerCase() !== complaintRole.name) {
      const normalizeName = dto.name.toLowerCase();
      const existing = await this.findOneByName(normalizeName);

      if (existing) {
        throw new BadRequestException(COMPLAINT_ROLE_ALREADY_EXIST);
      }
      complaintRole.name = normalizeName;
    }

    if (dto.user.id !== undefined) {
      complaintRole.user = dto.user ? (dto.user as User) : null;
    }

    await this.complaintRoleRepository.save(complaintRole);
    return await await this.findById(id);
  }

  async removeOne(id: string) {
    const existing = await this.findById(id);

    if (!existing) {
      throw new NotFoundException(COMPLAINT_ROLE_NOT_FOUND);
    }

    const result = await this.complaintRoleRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Запис з ID ${id} не знайдено`);
    }

    return { id, success: true };
  }

  async sendMessage(dto: SendComplaintMessageDto) {
    const role = await this.findById(dto.responsibleRoleId);

    if (!role || !role.user.email) {
      throw new NotFoundException(COMPLAINT_ROLE_NOT_FOUND);
    }

    try {
      const message = `
            Роль одержувача: ${role.name}

            Повідомлення:
            ${dto.message}

            Відправник: ${dto.senderEmail ?? '—'}

            З повагою,
            Команда підтримки
        `.replace(/\n/g, '<br>');

      await this.mailerService.sendMail({
        to: role?.user?.email,
        subject: 'Нове повiдомлення',
        html: `
            <pre style="font-family: Arial, sans-serif; font-size: 14px;">
                ${message}
            </pre>`,
      });

      return { success: true, message: 'Повідомлення надіслано' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
