import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { PushModule } from '../push/push.module';

@Module({
	imports: [TypeOrmModule.forFeature([Event, User, Role]), PushModule],
	controllers: [EventController],
	providers: [EventService],
})
export class EventModule {}
