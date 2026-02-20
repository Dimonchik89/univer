import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { User } from '../user/entities/user.entity';
import { PushModule } from '../push/push.module';
import { Event } from '../event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, User, Event]), PushModule],
  controllers: [ReminderController],
  providers: [ReminderService],
})
export class ReminderModule {}
