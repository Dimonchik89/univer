import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PushService } from '../push/push.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { USER_NOT_FOUND } from '../auth/constants/auth.constants';

@Injectable()
export class MessageService {

	constructor(
		@InjectRepository(Message) private messageRepository: Repository<Message>,
		@InjectRepository(User) private userRepository: Repository<User>,
		private pushService: PushService,
	) {}

	async createMessage({ content, groups, roles, title }: CreateMessageDto, userId: string) {
		const senderUser = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['roles']
		});

		if(!senderUser) {
			throw new BadRequestException("User not found");
		}

		// Перевiрка на роль користувача, добавлю @UseGuards(RolesGuard) @Roles(SystemRoleSlug.ADMINISTRATOR)
		const isSenderAdminOrTeacher = senderUser.roles.some(item =>
			['administrator', 'teacher', 'teacherGuarantor', 'teacherLeaders'].includes(item.slug)
		);
		if (!isSenderAdminOrTeacher) {
			throw new ForbiddenException("Только администраторы и учителя могут отправлять массовые сообщения.");
		}
		// ----------------------------------------------

		const message = await this.messageRepository.create({
			senderId: userId,
			title: title,
			message: content,
			roles,
			academic_groups: groups
		})

		await this.messageRepository.save(message)

		const roleIds = roles?.map(item => item.id) || [];
    	const groupIds = groups?.map(item => item.id) || [];

		await this.pushService.sendNewMessageNotification(roleIds, groupIds, title)
	}

	async findMessagesByRoleAndGroup(userId: string, page: number = 1, limit: number = 10) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['roles', 'academic_groups']
		});

		if(!user) {
			throw new UnauthorizedException(USER_NOT_FOUND)
		}

		const roleIds = user.roles.map((item) => item.id);
		const groupIds = user.academic_groups.map((item) => item.id);

		const qb = await this.messageRepository
			.createQueryBuilder("message")
			.leftJoin("message.roles", "roles")
			.leftJoin("message.academic_groups", "academic_groups")
			.select(['message.id', 'message.title', 'message.senderId', 'message.message', 'message.createdAt']);

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

		const baseQuery = await qb
			.where(whereClause, parameters)
			.groupBy('message.id')

		// return baseQuery

		const totalQuery = baseQuery.clone();
    	const uniqueIdsResult = await totalQuery
			.select('message.id')
    		.getMany();

		const totalCount = uniqueIdsResult.length;
		const skip = (page - 1) * limit;

		const messages = await baseQuery
        	.orderBy('message.createdAt', 'DESC')
			.limit(limit)
			.offset(skip)
			.getMany()

		return {
			messages,
			total: totalCount,
			page,
			limit
		};
	}
}
