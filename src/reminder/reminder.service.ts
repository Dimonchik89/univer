import { Injectable } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Interval } from '@nestjs/schedule';
import { User } from '../user/entities/user.entity';


@Injectable()
export class ReminderService {
	constructor(
		@InjectRepository(Reminder) private reminderRepository: Repository<Reminder>,
		@InjectRepository(User) private userRepository: Repository<User>
	) {}

	async create({ eventId, reminderTime }: CreateReminderDto, userId: string) {
		const reminder = await this.reminderRepository.create({
			user: { id: userId },
			event: { id: eventId },
			reminderTime,
			isSent: false
		})

		await this.reminderRepository.save(reminder);
		return { message: "successfully" }
	}


	// @Interval(10000)
	async handleReminders() {
		const now = new Date();

		const remindersToSend = await this.reminderRepository.find({
			where: {
				reminderTime: LessThanOrEqual(now),
				isSent: false
			},
			relations: ['user', 'event']
		});

		for(const reminder of remindersToSend) {
			const user = await this.userRepository.findOne({
				where: { id: reminder.user.id },
				relations: ["subscription"]
			})

			const res = user.subscription.map(item => ({
				id: item.id,
				endpoint: item.endpoint,
				expirationTime: item.expirationTime,
				keys: {
					auth: item.auth,
					p256dh: item.p256dh
				}
			}))

			// ОТПРАВЛЯЕМ УВЕДОМЛЕНИЕ ПРИ ПОМОЩИ sendNotification
			// нужно сделать что всем отправлять и их заголовки, второй аргумент в функцию sendNotification
			console.log("subscriptions", remindersToSend);


			// 3. Отметить как отправленное
			reminder.isSent = true;
			await this.reminderRepository.save(reminder);
		}


		// ОТПРАВЛЯЕМ УВЕДОМЛЕНИЕ ПРИ ПОМОЩИ sendNotification
		// нужно сделать что всем отправлять и их заголовки, второй аргумент в функцию sendNotification
		// console.log("subscriptions", remindersToSend);

	}
}
