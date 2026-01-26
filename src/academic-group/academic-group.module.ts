import { Module } from '@nestjs/common';
import { AcademicGroupService } from './academic-group.service';
import { AcademicGroupController } from './academic-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicGroup } from './entities/academic-group.entity';
import { Role } from '../role/entities/role.entity';
import { Chat } from '../chat/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicGroup, Role, Chat])],
  controllers: [AcademicGroupController],
  providers: [AcademicGroupService],
})
export class AcademicGroupModule {}
