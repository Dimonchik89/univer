import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PushSubscription } from '../push/entities/push-subscription.entity';
import { Role } from '../role/entities/role.entity';
import { AcademicGroup } from '../academic-group/entities/academic-group.entity';
import { Event } from '../event/entities/event.entity';
import { Chat } from '../chat/entities/chat.entity';
import { ChatMember } from '../chat/entities/chat-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PushSubscription,
      Role,
      AcademicGroup,
      Event,
      Chat,
      ChatMember,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
