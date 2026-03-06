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
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ScheduleGoogleSheetService } from './schedule.service';
import { CreateScheduleTableDto } from './dto/create-schedule-table.dto';
import { UpdateScheduleTableDto } from './dto/update-schedule-table.dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { SystemRoleSlug } from '../role/enums/role.enum';
import * as swaggerSchedule from './constants/swagger.schedule';
import * as swaggerConstants from '../common/swagger-constants';

@ApiCookieAuth('access_token')
@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleGoogleSheetController {
  constructor(
    @Inject() private readonly scheduleService: ScheduleGoogleSheetService,
  ) {}

  @ApiOperation({
    summary:
      'Create a record with information about the table containing the schedule (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiBody({ type: CreateScheduleTableDto })
  @ApiResponse({
    status: 201,
    description: swaggerSchedule.CREATE_ACADEMIC_GROUP_MESSAGE,
    example: swaggerSchedule.CREATE_SCHEDULE_TABLE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: swaggerConstants.ALREADY_EXIST_MESSAGE,
    example: swaggerSchedule.SCHEDULE_TABLE_ALREADY_EXIST_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Post('schedule-table')
  async createScheduleTable(@Body() dto: CreateScheduleTableDto) {
    return await this.scheduleService.createScheduleTable(dto);
  }

  @ApiOperation({
    summary:
      'Update a record with information about the table containing the schedule (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiBody({ type: UpdateScheduleTableDto })
  @ApiResponse({
    status: 201,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerSchedule.UPDATE_SCHEDULE_TABLE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerSchedule.SCHEDULE_TABLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Patch('schedule-table/:id')
  async updateScheduleTable(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleTableDto,
  ) {
    return await this.scheduleService.updateScheduleTable(id, dto);
  }

  @ApiOperation({
    summary:
      'Get all schedule table (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerSchedule.GET_ALL_SCHEDULE_TABLE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Get('schedule-table')
  async getAllScheduleTables(@Query() dto: { page: string; limit: string }) {
    return await this.scheduleService.getAllScheduleTables(dto);
  }

  @ApiOperation({
    summary:
      'Get schedule table by id (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerSchedule.GET_SCHEDULE_TABLE_BY_ID_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerSchedule.SCHEDULE_TABLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Get('schedule-table/:tableId')
  async getOneScheduleTable(@Param('tableId') tableId: string) {
    return await this.scheduleService.getOneScheduleTable(tableId);
  }

  @ApiOperation({
    summary:
      'Delete schedule table by id (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerSchedule.DELETE_SCHEDULE_TABLE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerSchedule.SCHEDULE_TABLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Delete('schedule-table/:tableId')
  async deleteScheduleTable(@Param('tableId') tableId: string) {
    return await this.scheduleService.deleteScheduleTable(tableId);
  }

  @ApiOperation({
    summary:
      'Parsing schedules from all created entries for Google Sheets (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerSchedule.PARSE_SCHEDULE_TABLE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 500,
    description: 'Error',
    // example: swaggerSchedule.SCHEDULE_TABLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Patch('parse')
  async parse() {
    return await this.scheduleService.parseAllTables();
  }

  @ApiOperation({
    summary:
      'Get a schedule for a group by id (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerSchedule.GET_SCHEDULE_FOR_GROUP_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerSchedule.SCHEDULE_TABLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':groupName')
  async get(@Param('groupName') groupName: string) {
    return await this.scheduleService.getScheduleGroup(groupName);
  }
}
