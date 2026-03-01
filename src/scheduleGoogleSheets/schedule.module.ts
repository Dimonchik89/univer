import { Module } from '@nestjs/common';
import { ScheduleGoogleSheetController } from './schedule.controller';
import { ScheduleGoogleSheetService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicGroup } from '../academic-group/entities/academic-group.entity';
import { ScheduleLesson } from './entities/schedule.entity';
import { AcademicGroupModule } from '../academic-group/academic-group.module';
import { ScheduleTable } from './entities/schedule-table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AcademicGroup, ScheduleLesson, ScheduleTable]),
    AcademicGroupModule,
  ],
  controllers: [ScheduleGoogleSheetController],
  providers: [ScheduleGoogleSheetService],
})
export class ScheduleGoogleSheetModule {}
