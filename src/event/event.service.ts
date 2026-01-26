import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PushService } from '../push/push.service';
import { USER_NOT_FOUND } from '../auth/constants/auth.constants';
import * as constants from './constants/event.constants';
import { QueryDto } from '../user/dto/query.dto';
import { ConfigService } from '@nestjs/config';
import { EVENT_NOT_FOUND } from './constants/event.constants';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private pushService: PushService,
    private configService: ConfigService,
  ) {}

  async createEvent(
    {
      message,
      academic_groups,
      roles,
      title,
      scheduledAt,
      location,
      registrationLink,
    }: CreateEventDto,
    userId: string,
  ) {
    const senderUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!senderUser) {
      throw new BadRequestException('User not found');
    }

    const event = await this.eventRepository.create({
      sender: { id: senderUser.id },
      title: title,
      message,
      roles,
      academic_groups,
      scheduledAt,
      location,
      registrationLink,
    });
    await this.eventRepository.save(event);

    const roleIds = roles?.map((item) => item.id) || [];
    const groupIds = academic_groups?.map((item) => item.id) || [];

    await this.pushService.sendNewMessageNotification({
      roleIds,
      groupIds,
      messageTitle: title,
      scheduledAt,
    });

    return { id: event.id, title: event.title, message: event.message };
  }

  async updateEvent(dto: UpdateEventDto, id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['roles', 'academic_groups'],
    });

    if (!event) {
      throw new NotFoundException(constants.EVENT_NOT_FOUND);
    }

    if (dto.roles) {
      event.roles = event.roles.filter((role) => {
        return dto.roles.find((item) => item.id === role.id);
      });
    }

    if (dto.academic_groups) {
      event.academic_groups = event.academic_groups.filter((group) => {
        return dto.academic_groups.find((item) => item.id === group.id);
      });
    }

    const updatedEvent = await this.eventRepository.merge(event, dto);
    await this.eventRepository.save(updatedEvent);
    return await this.eventRepository.findOne({
      where: { id },
      relations: ['academic_groups', 'roles'],
    });
  }

  async getOneEvent(id: string) {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .where({ id })
      .leftJoinAndSelect('event.roles', 'role')
      .leftJoinAndSelect('event.academic_groups', 'academic_group')
      .leftJoin('event.sender', 'sender')
      .addSelect(['sender.email', 'sender.firstName', 'sender.lastName'])
      .getOne();

    if (!event) {
      throw new NotFoundException(EVENT_NOT_FOUND);
    }

    return event;
  }

  async delete(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(EVENT_NOT_FOUND);
    }

    return await this.eventRepository.delete(id);
  }

  async getAllEvents(query: QueryDto) {
    const baseQuery = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.roles', 'role')
      .leftJoinAndSelect('event.academic_groups', 'academic_group')
      .leftJoin('event.sender', 'sender')
      .addSelect(['sender.email', 'sender.firstName', 'sender.lastName']);

    const limit =
      +query.limit || +this.configService.get('DEFAULT_PAGE_SIZE') || 10;
    const page = +query.page || 1;
    const skip = (page - 1) * limit;

    const countQuery = baseQuery.clone();
    const totalCount = (await countQuery.getMany()).length;

    const results = await baseQuery.limit(limit).offset(skip).getMany();

    return {
      results,
      page,
      limit,
      total: totalCount,
    };
  }

  async findMessagesByRoleAndGroup({
    userId,
    page = 1,
    limit = 10,
  }: {
    userId: string;
    page: number;
    limit: number;
  }) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'academic_groups'],
    });

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    const roleIds = user.roles.map((item) => item.id);
    const groupIds = user.academic_groups.map((item) => item.id);

    // const qb = await this.eventRepository
    // 	.createQueryBuilder("message")
    // 	.leftJoin("message.roles", "roles")
    // 	.leftJoin("message.academic_groups", "academic_groups")
    // 	.select(['message.id', 'message.title', 'message.senderId', 'message.message', 'message.createdAt']);
    const qb = await this.eventRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.roles', 'roles')
      .leftJoinAndSelect('message.academic_groups', 'academic_groups');

    let whereConditions: string[] = [];
    const parameters: { [key: string]: any } = {};

    if (roleIds?.length > 0) {
      whereConditions.push('roles.id IN (:...roleIds)');
      parameters.roleIds = roleIds;
    }

    if (groupIds?.length > 0) {
      whereConditions.push('academic_groups.id IN (:...groupIds)');
      parameters.groupIds = groupIds;
    }

    if (whereConditions.length === 0) {
      return { messages: [], total: 0 };
    }

    const whereClause = whereConditions.join(' OR ');

    const baseQuery = await qb.where(whereClause, parameters);

    const totalQuery = baseQuery.clone();
    const uniqueIdsResult = await totalQuery.select('message.id').getMany();

    const totalCount = uniqueIdsResult.length;
    const skip = (page - 1) * limit;

    const messages = await baseQuery
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .offset(skip)
      .getMany();

    return {
      results: messages,
      total: totalCount,
      page,
      limit,
    };
  }

  async getEventsForDay(dateString: string, userId: string) {
    const startOfDay = new Date(dateString);

    // if(isNaN(startOfDay.getTime())) {
    // 	throw new BadRequestException("не вiрний формат дати")
    // }

    // const startOfDay = this.parseLocalDate(dateString);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateString);
    // const endOfDay = this.parseLocalDate(dateString);
    endOfDay.setHours(23, 59, 59, 999);

    // console.log("startOfDay", startOfDay); // "2025-11-17T20:30:00Z" с Z (учитывает таймзону) пробую 2025-11-29
    // console.log("endOfDay", endOfDay);

    let user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.academic_groups', 'academic_group')
      .select(['user.id', 'role.id', 'academic_group'])
      .getOne();

    const eventQuery = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.roles', 'role')
      .leftJoinAndSelect('event.academic_groups', 'academic_group')
      .leftJoin('event.sender', 'sender')
      .addSelect(['sender.email', 'sender.firstName', 'sender.lastName'])
      .orderBy('event.scheduledAt', 'ASC')
      .where('event.scheduledAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      });

    const roleIds = user.roles.map((item) => item.id);
    const groupIds = user.academic_groups.map((item) => item.id);

    if (user.roles.length || user.academic_groups.length) {
      const conditions: string[] = [];
      const parameters: any = {};

      if (roleIds.length) {
        conditions.push('role.id IN (:...roles)');
        parameters.roles = roleIds;
      }

      if (groupIds.length) {
        conditions.push('academic_group.id IN (:...groups)');
        parameters.groups = groupIds;
      }

      eventQuery.andWhere(`(${conditions.join(' OR ')})`, parameters);
    }

    return eventQuery.getMany();
  }

  async getDaysWithEventsInMonth(monthString: string, userId: string) {
    const startOfMonth = new Date(`${monthString}-01`);
    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0,
    );
    endOfMonth.setHours(23, 59, 59, 999);

    let user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.academic_groups', 'academic_group')
      .select(['user.id', 'role.id', 'academic_group'])
      .getOne();

    const eventQuery = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.roles', 'role')
      .leftJoinAndSelect('event.academic_groups', 'academic_group')
      .orderBy('event.scheduledAt', 'ASC')
      .where('event.scheduledAt BETWEEN :start AND :end', {
        start: startOfMonth,
        end: endOfMonth,
      });

    const roleIds = user.roles.map((item) => item.id);
    const groupIds = user.academic_groups.map((item) => item.id);

    if (user.roles.length || user.academic_groups.length) {
      const conditions: string[] = [];
      const parameters: any = {};

      if (roleIds.length) {
        conditions.push('role.id IN (:...roles)');
        parameters.roles = roleIds;
      }

      if (groupIds.length) {
        conditions.push('academic_group.id IN (:...groups)');
        parameters.groups = groupIds;
      }

      eventQuery.andWhere(`(${conditions.join(' OR ')})`, parameters);
    }

    const result = await eventQuery.getMany();

    return result.map((row) => row.scheduledAt);
  }

  parseLocalDate(dateString: string) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
