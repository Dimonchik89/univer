import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ScheduleGoogleSheetService } from './schedule.service';
import { CreateScheduleTableDto } from './dto/create-schedule-table.dto';
import { UpdateScheduleTableDto } from './dto/update-schedule-table.dto';

@Controller('schedule')
export class ScheduleGoogleSheetController {
  constructor(
    @Inject() private readonly scheduleService: ScheduleGoogleSheetService,
  ) {}

  @Post('schedule-table/create')
  async createScheduleTable(@Body() dto: CreateScheduleTableDto) {
    return await this.scheduleService.createScheduleTable(dto);
  }

  @Patch('schedule-table/create')
  async updateScheduleTable(@Body() dto: UpdateScheduleTableDto) {
    return await this.scheduleService.updateScheduleTable(dto);
  }

  @Get('schedule-table/findAll')
  async getAllScheduleTables(@Query() dto: { page: string; limit: string }) {
    return await this.scheduleService.getAllScheduleTables(dto);
  }

  @Delete('schedule-table/:tableId')
  async deleteScheduleTable(@Param('tableId') tableId: string) {
    return await this.scheduleService.deleteScheduleTable(tableId);
  }

  @Get('schedule-table/:tableId')
  async getOneScheduleTable(@Param('tableId') tableId: string) {
    return await this.scheduleService.getOneScheduleTable(tableId);
  }

  @Patch('update')
  async update() {
    // return { message: 'ok' };
    return await this.scheduleService.parseAllTables();
  }

  @Get(':groupId')
  async get(@Param('groupId') groupId: string) {
    return await this.scheduleService.getScheduleGroup(groupId);
  }
}
