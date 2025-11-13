import { BadRequestException, Body, Controller, Delete, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PushService } from './push.service';
import { Repository } from 'typeorm';
import { PushSubscription } from './entities/push-subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateSubscriptionDto from './dto/create-subscription.dto';
import { DeleteSubscriptionDto } from './dto/dele-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';

@Controller('subscriptions')
export class PushController {
  constructor(
	private pushService: PushService,
	@InjectRepository(PushSubscription) private subscriptionRepository: Repository<PushSubscription>
	) {}

	@Post()
	async subscribe(@Body() dto: CreateSubscriptionDto) {
		const { id, expirationTime, ...tailDto } = dto; // dto це обьект який сформуэ браузер з посиланням i iншими необхiдними данними якi збережемо в базу данних i ID користувача для зв'язку мiж таблицями

		console.log(dto);


		const newSubscription = await this.subscriptionRepository.create({
			endpoint: tailDto.endpoint,
			p256dh: tailDto.keys.p256dh,
			auth: tailDto.keys.auth,
			expirationTime,
			user: { id }
		})

		const saved = await this.subscriptionRepository.save(newSubscription);
		return { message: "Пiдписку збережно", saved }
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
	@Delete()
	async unsubscribe(@Req() req, @Body() dto: DeleteSubscriptionDto) {
		// добавит стратегию jwt потом в сервисе проверять есть ли такой пользователь и есть ли у этого пользователя такая подписка. если да удалять если нет то ошибка

		if (!dto.endpoint) {
			throw new BadRequestException('Endpoint is required.');
		}
		await this.pushService.deleteSubscription({userId: req.user.id, endpoint: dto.endpoint});
		return { success: true };
	}
}
