import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleTableDto } from './create-schedule-table.dto';

export class UpdateScheduleTableDto extends PartialType(
  CreateScheduleTableDto,
) {}
