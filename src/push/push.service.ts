import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PushSubscription } from './entities/push-subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from "web-push";
import { UserService } from '../user/user.service';
import { Subscription } from '../types/subscription';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { SUBSCRIPTION_NOT_FOUND } from './constants/push-subscription.constants';

interface CustomSubscriptions extends Subscription {
	id: string
}

@Injectable()
export class PushService {
	private readonly logger = new Logger(PushSubscription.name);

	constructor(
		@InjectRepository(PushSubscription) private subscriptionRepository: Repository<PushSubscription>,
		private userService: UserService,
		private configService: ConfigService
	) {
		webpush.setVapidDetails(
			'mailto:dmitroevmenov@gmail.com',
			process.env.VAPID_PUBLIC_KEY,
			process.env.VAPID_PRIVATE_KEY
		)
	}

	private async sendNotification({ subscriptions, title, scheduledAt }: { subscriptions: CustomSubscriptions[], title: string, scheduledAt: Date }): Promise<void> {
    	const payload = JSON.stringify({
			title: title,
			body: "У вас нове повiдомлення",
			tag: "new-message",
			icon: `${this.configService.get("SERVER_URL")}/static/logo.jpg`,
			scheduledAt: scheduledAt
		});

		const sendPromises = subscriptions.map((sub) => {
			const {id, ...tailSub} = sub;

			return webpush.sendNotification(tailSub, payload) // вiдправляэмо повыдомлення
				.catch(async (error) => {
					this.logger.error(`Error sending push: ${error.statusCode} for ID ${sub.endpoint}`);

					if(error.statusCode === 410) {
						await this.subscriptionRepository.delete(id);
					}
				});
		});

		await Promise.all(sendPromises);
	}

	async sendRemindNotification({ subscriptions, title, scheduledAt } : {subscriptions: CustomSubscriptions[], title: string, scheduledAt: Date}) {
		await this.sendNotification({subscriptions, title, scheduledAt})
	}

	async sendNewMessageNotification({ groupIds, roleIds, messageTitle, scheduledAt }: {roleIds: string[] | null, groupIds: string[] | null, messageTitle: string, scheduledAt: Date}): Promise<void> {

		// Знаходимо всiх користувачiв з пыдпискою у яких э або вказано з масиву обектiв роль або академiчна группа ["tererter-nfvnvbnv-dgdfgbd"] (перетворюэться з масиву такого вигляду [{"id": "sdfsdf-esdfsdfsd-dgfdf"}] в MessageService.createMessage )
		const qb = await this.subscriptionRepository
			.createQueryBuilder("sub")
			.leftJoin("sub.user", 'user')
			.leftJoin("user.roles", "roles")
			.leftJoin("user.academic_groups", "academic_groups")
			.select(['sub.id', 'sub.endpoint', 'sub.p256dh', 'sub.auth', 'sub.expirationTime']);

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
			return;
		}

		const whereClause = whereConditions.join(' OR ');

		const subscriptions = await qb
			.where(whereClause, parameters)
			.groupBy('sub.id')
			.addGroupBy('sub.endpoint')
			.addGroupBy('sub.user')
			.getMany();

		// формуэмо правильнi об'экти для webpush.sendNotification
		const subscriptionFinally= subscriptions.map(item => ({
			id: item.id,
			endpoint: item.endpoint,
			expirationTime: item.expirationTime,
			keys: {
				p256dh: item.p256dh,
				auth: item.auth
			}
		}))

		await this.sendNotification({ subscriptions: subscriptionFinally, title: messageTitle, scheduledAt });
	}

	async deleteSubscription({ userId, endpoint }: { userId: string, endpoint: string}) {
		const subscription = await this.subscriptionRepository.findOne({
			where: {
				endpoint,
				user: {
					id: userId
				}
			},
			relations: ["user"]
		})

		if(!subscription) {
			throw new NotFoundException(SUBSCRIPTION_NOT_FOUND);
		}

		await this.subscriptionRepository.delete({ endpoint })
	}
}
