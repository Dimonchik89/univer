import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';

@Controller('reminder')
export class ReminderController {
	constructor(private readonly reminderService: ReminderService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Body() createReminderDto: CreateReminderDto, @Req() req) {
		return await this.reminderService.create(createReminderDto, req.user.id);
	}


}
