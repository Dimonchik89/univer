import { BadRequestException, Body, Controller, Delete, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PushService } from './push.service';
import { Repository } from 'typeorm';
import { PushSubscription } from './entities/push-subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateSubscriptionDto from './dto/create-subscription.dto';
import { DeleteSubscriptionDto } from './dto/dele-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as pushSubscriptionConstance from "./constants/push-subscription.constants"
import * as swaggerPushSubscription from "./constants/swagger.push";
import * as swaggerConstants from "../common/swagger-constants";
@ApiTags("Subscriptions")
@Controller('subscriptions')
export class PushController {
  constructor(
	private pushService: PushService,
	@InjectRepository(PushSubscription) private subscriptionRepository: Repository<PushSubscription>
	) {}

	@ApiOperation({ summary: swaggerPushSubscription.CREATE_SUBSCRIPTION_SUMMARY })
	@ApiHeader(swaggerConstants.HEADER_ACCESS_TOKEN_EXAMPLE)
	@ApiResponse({
		status: 201,
		description: swaggerPushSubscription.SUBSCRIPTION_CREATED_MESSAGE,
		example: swaggerPushSubscription.SUBSCRIPTION_CREATED_EXAMPLE
	})
	@ApiResponse({
		status: 401,
		description: swaggerConstants.UNAUTHORIZED_MESSAGE,
		example: swaggerConstants.UNAUTHORIZED_EXAMPLE
	})
	@UseGuards(JwtAuthGuard)
	@Post()
	async subscribe(@Req() req, @Body() dto: CreateSubscriptionDto) {
		// const { id, expirationTime, ...tailDto } = dto;
		const { expirationTime, ...tailDto } = dto;

		const newSubscription = await this.subscriptionRepository.create({
			endpoint: tailDto.endpoint,
			p256dh: tailDto.keys.p256dh,
			auth: tailDto.keys.auth,
			expirationTime,
			user: { id: req.user.id }
		})

		const saved = await this.subscriptionRepository.save(newSubscription);
		return { message: pushSubscriptionConstance.SUBSCRIPTION_SUCCESSFULLY_MESSAGE, saved }
	}

	@ApiOperation({ summary: swaggerPushSubscription.DELETE_SUBSCRIPTION_SUMMARY })
	@ApiHeader(swaggerConstants.HEADER_ACCESS_TOKEN_EXAMPLE)
	@ApiResponse({
		status: 200,
		description: swaggerPushSubscription.SUBSCRIPTION_DELETED_MESSAGE,
		example: swaggerPushSubscription.SUBSCRIPTION_DELETED_EXAMPLE
	})
	@ApiResponse({
		status: 400,
		description: swaggerPushSubscription.NO_SUBSCRIPTION_ENDPOINT_MESSAGE,
		example: swaggerPushSubscription.ENDPOINT_IS_REQUIRED_EXAMPLE
	})
	@ApiResponse({
		status: 404,
		description: swaggerPushSubscription.SUBSCRIPTION_NOT_FOUND_MESSAGE,
		example: swaggerPushSubscription.NOT_FOUND_EXAMPLE
	})
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
	@Delete()
	async unsubscribe(@Req() req, @Body() dto: DeleteSubscriptionDto) {
		// добавит стратегию jwt потом в сервисе проверять есть ли такой пользователь и есть ли у этого пользователя такая подписка. если да удалять если нет то ошибка

		if (!dto.endpoint) {
			throw new BadRequestException(pushSubscriptionConstance.ENDPOINT_IS_REQUIRED_MESSAGE);
		}
		await this.pushService.deleteSubscription({userId: req.user.id, endpoint: dto.endpoint});
		return { message: pushSubscriptionConstance.SUBSCRIPTION_DELETED_MESSAGE };
	}
}
