import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as swaggerReminder from './constants/swagger.reminder';
import * as swaggerConstants from '../common/swagger-constants';
import { DeleteReminderParamsDto } from './dto/delete-reminder.params.dto';
@ApiCookieAuth('access_token')
@ApiTags('Reminder')
@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @ApiOperation({ summary: swaggerReminder.CREATE_REMINDER_SUMMARY })
  @ApiResponse({
    status: 201,
    description: swaggerReminder.REMINDER_CREATED_MESSAGE,
    example: swaggerReminder.REMINDER_CREATED_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createReminderDto: CreateReminderDto, @Req() req) {
    return await this.reminderService.create(createReminderDto, req.user.id);
  }

  @ApiOperation({ summary: swaggerReminder.DELETE_REMINDED_SUMMARY })
  @ApiResponse({
    status: 200,
    description: swaggerReminder.REMINDER_DELETED_MESSAGE,
    example: swaggerReminder.REMINDER_SUCCESSFULLY_DELETED_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerReminder.NOT_FOUND_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param() params: DeleteReminderParamsDto, @Req() req) {
    const { id } = params;

    return await this.reminderService.delete({
      reminderId: id,
      userId: req.user.id,
    });
  }
}
