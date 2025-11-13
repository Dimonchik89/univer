import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { Role } from '../role/entities/role.entity';
import { AcademicGroup } from '../academic-group/entities/academic-group.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { SystemRoleSlug } from '../role/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post()
  async create(@Body() data: CreateMessageDto, @Req() req) {
    await this.messageService.createMessage(data, req.user.id);

    return { success: true, message: 'Сообщение отправлено инициирована рассылка уведомлений.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMessagesByRoleAndGroup(@Req() req) {
	return await this.messageService.findMessagesByRoleAndGroup(req.user.id)
  }
}
