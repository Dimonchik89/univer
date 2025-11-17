import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PushSubscription } from '../push/entities/push-subscription.entity';
import { Message } from '../message/entities/message.entity';
import { Role } from '../role/entities/role.entity';
import { AcademicGroup } from '../academic-group/entities/academic-group.entity';
import { Event } from '../event/entities/event.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, PushSubscription, Message, Role, AcademicGroup, Event])],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
