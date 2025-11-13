import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { PushModule } from '../push/push.module';
import { Role } from '../role/entities/role.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Message, User, Role]), PushModule],
	controllers: [MessageController],
	providers: [MessageService],
})
export class MessageModule {}
