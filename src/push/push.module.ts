import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushSubscription } from './entities/push-subscription.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([PushSubscription]), UserModule],
	controllers: [PushController],
	providers: [PushService],
	exports: [PushService]
})
export class PushModule {}
