import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Interval } from '@nestjs/schedule';
import { User } from '../user/entities/user.entity';
import { PushService } from '../push/push.service';
import { NotFoundError } from 'rxjs';
import * as reminderConstants from './constants/reminder.constants';
import { Event } from '../event/entities/event.entity';
import { REMINDER_NOT_FOUND } from './constants/reminder.constants';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private pushService: PushService,
  ) {}

  async create({ eventId, reminderTime }: CreateReminderDto, userId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(REMINDER_NOT_FOUND);
    }

    const delta =
      new Date(reminderTime).getTime() - event?.scheduledAt.getTime();

    if (delta > 0) {
      throw new BadRequestException(
        'не можна задати нагадування після дати події',
      );
    }

    const reminder = await this.reminderRepository.create({
      user: { id: userId },
      event: { id: eventId },
      reminderTime,
      isSent: false,
    });

    await this.reminderRepository.save(reminder);
    return { message: reminderConstants.REMINDER_CREATED, success: true };
  }

  async delete({ reminderId, userId }: { reminderId: string; userId: string }) {
    const deleteResult = await this.reminderRepository.delete({
      id: reminderId,
      user: { id: userId },
    });

    if (deleteResult.affected === 0) {
      throw new NotFoundException(reminderConstants.REMINDER_NOT_FOUND);
    }

    return { message: reminderConstants.REMINDER_DELETED, success: true };
  }

  @Interval(10000)
  async handleReminders() {
    const now = new Date();

    // Знаходимо всi подii якi мають reminderTime меньше нiж поточний час
    // та щоб isSent буде false тобто ще не вiдпралено
    const remindersToSend = await this.reminderRepository
      .createQueryBuilder('reminder')
      .leftJoinAndSelect('reminder.user', 'user')
      .leftJoinAndSelect('reminder.event', 'event')
      .where('reminder.reminderTime <= :now', { now: now.toISOString() })
      .andWhere('reminder.isSent = :isSent', { isSent: false })
      .getMany();

    for (const reminder of remindersToSend) {
      const user = await this.userRepository.findOne({
        where: { id: reminder.user.id },
        relations: ['subscription'],
      });

      // формуэмо валiдний масив з данними для вiдправлення push-повiдомлень
      const res = user.subscription.map((item) => ({
        id: item.id,
        endpoint: item.endpoint,
        expirationTime: item.expirationTime,
        keys: {
          auth: item.auth,
          p256dh: item.p256dh,
        },
      }));

      // ОТПРАВЛЯЕМ УВЕДОМЛЕНИЕ ПРИ ПОМОЩИ sendNotification
      // нужно сделать что всем отправлять и их заголовки, второй аргумент в функцию sendNotification
      // this.pushService.sendRemindNotification(res, reminder.event.title)
      this.pushService.sendRemindNotification({
        subscriptions: res,
        title: reminder.event.title,
        scheduledAt: reminder.event.scheduledAt,
      });

      // Отметить как отправленное
      // Возможно удалять после того как отправили
      reminder.isSent = true;
      // await this.reminderRepository.save(reminder);
      await this.delete({ reminderId: reminder.id, userId: user.id });
    }

    // ОТПРАВЛЯЕМ УВЕДОМЛЕНИЕ ПРИ ПОМОЩИ sendNotification
    // нужно сделать что всем отправлять и их заголовки, второй аргумент в функцию sendNotification
    // console.log("subscriptions", remindersToSend);
  }
}
