import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SystemRoleSlug } from './enums/role.enum';
import * as swaggerConstants from '../common/swagger-constants';
import * as swaggerRoleConstants from './constants/swagger.role';
import { FindAllRoleQueryDto } from './dto/role.search-query.dto';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: swaggerRoleConstants.CREATE_ROLE_SUMMARY })
  @ApiBody({
    // schema: {
    // 	example: swaggerConstants.CREATE_ROLE_BODY_EXAMPLE
    // }
    type: CreateRoleDto,
  })
  @ApiHeader(swaggerConstants.HEADER_ACCESS_TOKEN_EXAMPLE)
  @ApiResponse({
    status: 200,
    description: 'Successful role creation',
    example: swaggerRoleConstants.ROLE_SUCCESS_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: swaggerRoleConstants.ROLE_ALREADY_EXIST_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    schema: {
      example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: swaggerRoleConstants.GET_ALL_ROLES_SUMMARY })
  @ApiHeader(swaggerConstants.HEADER_ACCESS_TOKEN_EXAMPLE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: swaggerRoleConstants.GET_ALL_ROLE_EXAMPLE,
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
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR, SystemRoleSlug.DEKAN)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() params: FindAllRoleQueryDto) {
    return this.roleService.findAll(params);
  }

  @ApiOperation({ summary: swaggerRoleConstants.GET_ROLE_BY_ID_SUMMARY })
  @ApiHeader(swaggerConstants.HEADER_ACCESS_TOKEN_EXAMPLE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: swaggerRoleConstants.GET_ROLE_BY_ID_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerRoleConstants.ROLE_NOT_FOUND_MESSAGE,
    example: swaggerRoleConstants.ROLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({ summary: swaggerRoleConstants.UPDATE_ROLE_BY_ID_SUMMARY })
  @ApiHeader(swaggerConstants.HEADER_ACCESS_TOKEN_EXAMPLE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: swaggerRoleConstants.GET_ALL_ROLE_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
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
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @ApiOperation({
    summary:
      'Delete role dy ID (You need to add an administrator access_token or other users who have the required permissions)',
  })
  @ApiHeader(swaggerConstants.HEADER_ACCESS_TOKEN_EXAMPLE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: swaggerRoleConstants.ROLE_DELETED_SUCCESS_EXAMPLE,
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
    description: swaggerRoleConstants.ROLE_NOT_FOUND_MESSAGE,
    example: swaggerRoleConstants.ROLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
