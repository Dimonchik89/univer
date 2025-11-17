import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Req, Query, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { SystemRoleSlug } from '../role/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

    @UseGuards(RolesGuard)
	@Roles(SystemRoleSlug.ADMINISTRATOR)
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
	@Post()
	async create(@Body() data: CreateEventDto, @Req() req) {
		await this.eventService.createEvent(data, req.user.id);

		return { success: true, message: 'Сообщение отправлено инициирована рассылка уведомлений.' };
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async findMessagesByRoleAndGroup(@Req() req) {
		return await this.eventService.findMessagesByRoleAndGroup(req.user.id)
	}

	@UseGuards(JwtAuthGuard)
	@Get("by-date")
	async getEventByDate(
		@Request() req: any,
		@Query("date") date?: string,
		@Query("month") month?: string,
	) {
		if(date) {
			return this.eventService.getEventsForDay(date, req.user.id);
		}

		if(month) {
			return this.eventService.getDaysWithEventsInMonth(month, req.user.id);
		}

		return [];
	}
}
