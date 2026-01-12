import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Query,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { SystemRoleSlug } from '../role/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as swaggerConstants from '../common/swagger-constants';
import * as swaggerEvent from './constants/swagger.event';
import { GetEventByDateQueryDto } from './dto/get-event-by-date.query.dto';
import { QueryDto } from '../user/dto/query.dto';

@ApiCookieAuth('access_token')
@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: swaggerEvent.CREATE_EVENT_SUMMARY })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 200,
    description: swaggerEvent.VALIDATION_PIPE_CREATE_EVENT_SUCCESS_MESSAGE,
    example: swaggerEvent.VALIDATION_PIPE_CREATE_EVENT_SUCCESS_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          notValidUUID: {
            summary: swaggerEvent.NOT_VALID_UUID,
            value: swaggerEvent.VALIDATION_PIPE_NOT_VALID_EXAMPLE,
          },
          propertyShouldNotExist: {
            summary: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
            value: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
          },
        },
      },
    },
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post()
  async create(@Body() data: CreateEventDto, @Req() req) {
    const event = await this.eventService.createEvent(data, req.user.id);
    return event;
    // return {
    //   success: true,
    //   message: 'Сообщение отправлено инициирована рассылка уведомлений.',
    // };
  }

  @ApiOperation({ summary: swaggerEvent.UPDATE_EVENT_SUMMARY })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 200,
    description: swaggerEvent.EVENT_UPDATED_MESSAGE,
    example: swaggerEvent.UPDATE_EVENT_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          notValidUUID: {
            summary: swaggerEvent.NOT_VALID_UUID,
            value: swaggerEvent.VALIDATION_PIPE_NOT_VALID_EXAMPLE,
          },
          propertyShouldNotExist: {
            summary: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
            value: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
          },
        },
      },
    },
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateEvent(@Body() dto: UpdateEventDto, @Param('id') id: string) {
    return await this.eventService.updateEvent(dto, id);
  }

  //  -------------------------------------- Перепроверить документацию!!!!!!!!!
  @ApiOperation({ summary: swaggerEvent.GET_ONE_EVENT_BY_ID_SUMMARY })
  @ApiResponse({
    status: 200,
    description: swaggerEvent.GET_ONE_EVENT_MESSAGE,
    example: swaggerEvent.GET_ONE_EVENT_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerEvent.EVENT_BY_ID_NOT_FOUND_MESSAGE,
    example: swaggerEvent.EVENT_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Get('one-event-by-admin/:id')
  async getOneEvent(@Param('id') id: string) {
    return await this.eventService.getOneEvent(id);
  }

  //   ------ Додати документацiю SWAGGER
  @ApiOperation({ summary: swaggerEvent.DELETE_EVENT_BY_ID_SUMMARY })
  @ApiResponse({
    status: 200,
    description: swaggerEvent.EVENT_DELETED_MESSAGE,
    example: swaggerEvent.EVENT_DELETED_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerEvent.EVENT_BY_ID_NOT_FOUND_MESSAGE,
    example: swaggerEvent.EVENT_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.eventService.delete(id);
  }

  //   --------------------------------------------------------------------------

  @ApiOperation({ summary: swaggerEvent.GET_ALL_EVENTS_SUMMARY })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
    example: swaggerEvent.GET_ALL_EVENTS_BY_ROLE_AND_GROUP_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          notValidUUID: {
            summary: swaggerEvent.NOT_VALID_UUID,
            value: swaggerEvent.VALIDATION_PIPE_NOT_VALID_EXAMPLE,
          },
          propertyShouldNotExist: {
            summary: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
            value: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
          },
        },
      },
    },
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllEvents(@Query() query: QueryDto) {
    return await this.eventService.getAllEvents(query);
  }

  @ApiOperation({ summary: swaggerEvent.GET_EVENTS_BY_ROLE_AND_GROUP_SUMMARY })
  @ApiResponse({
    status: 200,
    description: swaggerEvent.GET_ALL_EVENTS_BY_ROLE_AND_GROUP_MESSAGE,
    example: swaggerEvent.GET_ALL_EVENTS_BY_ROLE_AND_GROUP_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Get('by-role-and-group')
  async findMessagesByRoleAndGroup(@Req() req, @Query() query: QueryDto) {
    return await this.eventService.findMessagesByRoleAndGroup({
      userId: req.user.id,
      page: +query?.page || 1,
      limit: +query?.limit || 10,
    });
  }

  @ApiOperation({ summary: swaggerEvent.GET_EVENTS_BY_DATE })
  // @ApiResponse({
  // 	status: 200,
  // 	description: swaggerEvent.GET_EVENT_BY_DATE_SUCCESSFULLY_MESSAGE,
  // 	example: swaggerEvent.EVENT_BY_DATE_EXAMPLE
  // })
  @ApiResponse({
    status: 200,
    description: swaggerEvent.GET_EVENT_BY_DATE_SUCCESSFULLY_MESSAGE,
    content: {
      'application/json': {
        examples: {
          getEventOfTheMonth: {
            summary: 'Get events of the month',
            value: swaggerEvent.EVENT_BY_MONTH_EXAMPLE,
          },
          propertyShouldNotExist: {
            summary: 'Get events of the day',
            value: swaggerEvent.EVENT_BY_DATE_EXAMPLE,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: swaggerEvent.INVALID_DATE_MESSAGE,
    example: swaggerEvent.NOT_VALID_DATE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @Get('by-date')
  async getEventByDate(
    @Request() req: any,
    @Query() query?: GetEventByDateQueryDto,
  ) {
    const { date, month } = query;

    if (date) {
      return this.eventService.getEventsForDay(date, req.user.id);
    }

    if (month) {
      return this.eventService.getDaysWithEventsInMonth(month, req.user.id);
    }
    return [];
  }
}
