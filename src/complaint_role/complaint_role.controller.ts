import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { CreateComplaintRoleDto } from './dto/create-complaint-role.dto';
import { ComplaintRoleService } from './complaint_role.service';
import { SystemRoleSlug } from '../role/enums/role.enum';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as swaggerConstants from '../common/swagger-constants';
import * as swaggerComplaintRole from './constants/swagger.complaint_role';
import { QueryDto } from '../user/dto/query.dto';
import { UpdateComplaintRole } from './dto/update-complaint-role.dto';
import { SendComplaintMessageDto } from './dto/send-complaint-message.dto';

@ApiCookieAuth('access_token')
@ApiTags('Complaint Role')
@Controller('complaint-role')
export class ComplaintRoleController {
  constructor(private readonly complaintRoleService: ComplaintRoleService) {}

  @ApiOperation({
    summary:
      'Creation of a new complaint role (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 201,
    description: swaggerComplaintRole.CREATE_COMPLAINT_ROLE_MESSAGE,
    example: swaggerComplaintRole.COMPLAINT_ROLE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: swaggerConstants.ALREADY_EXIST_MESSAGE,
    example: swaggerComplaintRole.COMPLAINT_ROLE_ALREADY_EXIST_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiBody({ type: CreateComplaintRoleDto })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post()
  async create(@Body() dto: CreateComplaintRoleDto) {
    return await this.complaintRoleService.create(dto);
  }

  @ApiOperation({
    summary:
      'Get all complaint role (You need to add access_token to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerComplaintRole.GET_ALL_COMPLAINT_ROLE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Get()
  async findAll(@Query() params: QueryDto) {
    return await this.complaintRoleService.findAll(params);
  }

  @ApiOperation({
    summary:
      'Get complaint role by id (You need to add access_token to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerComplaintRole.COMPLAINT_ROLE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerComplaintRole.COMPLAINT_ROLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.complaintRoleService.findOne(id);
  }

  @ApiOperation({
    summary:
      'Update complaint role by id (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiBody({ type: CreateComplaintRoleDto })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerComplaintRole.COMPLAINT_ROLE_EXAMPLE,
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
    example: swaggerComplaintRole.COMPLAINT_ROLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Patch(':id')
  async updateOne(@Body() dto: UpdateComplaintRole, @Param('id') id: string) {
    return await this.complaintRoleService.updateOne(dto, id);
  }

  @ApiOperation({
    summary:
      'Delete complaint role by id (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerComplaintRole.DELETE_COMPLAINT_ROLE_EXAMPLE,
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
    example: swaggerComplaintRole.COMPLAINT_ROLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.complaintRoleService.removeOne(id);
  }

  @ApiOperation({
    summary:
      'Sending an anonymous message to a specific responsible role (You need to add an access_token to the cookie)',
  })
  @ApiBody({ type: SendComplaintMessageDto })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerComplaintRole.MESSAGE_SENT_SUCCESSFULLY_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerComplaintRole.COMPLAINT_ROLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Post('send-message')
  async sendMessage(@Body() dto: SendComplaintMessageDto) {
    return this.complaintRoleService.sendMessage(dto);
  }
}
