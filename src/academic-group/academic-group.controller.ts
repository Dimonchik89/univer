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
import { AcademicGroupService } from './academic-group.service';
import { CreateAcademicGroupDto } from './dto/create-academic-group.dto';
import { UpdateAcademicGroupDto } from './dto/update-academic-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { SystemRoleSlug } from '../role/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as swaggerConstants from '../common/swagger-constants';
import * as swaggerAcademicGroup from './constants/swagger.academic-group';
import { QueryDto } from '../user/dto/query.dto';
@ApiCookieAuth('access_token')
@ApiTags('Academic Groups')
@Controller('academic-group')
export class AcademicGroupController {
  constructor(private readonly academicGroupService: AcademicGroupService) {}

  @ApiOperation({
    summary:
      'Creation of a new academic group (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiBody({ type: CreateAcademicGroupDto })
  @ApiResponse({
    status: 201,
    description: swaggerAcademicGroup.CREATE_ACADEMIC_GROUP_MESSAGE,
    example: swaggerAcademicGroup.CREATE_ACADEMIC_GROUP_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: swaggerConstants.ALREADY_EXIST_MESSAGE,
    example: swaggerAcademicGroup.ACADEMIC_GROUP_ALREADY_EXIST_EXAMPLE,
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
  @Post()
  async create(@Body() createAcademicGroupDto: CreateAcademicGroupDto) {
    return await this.academicGroupService.create(createAcademicGroupDto);
  }

  @ApiOperation({
    summary:
      'Get all academic group (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerAcademicGroup.GET_ALL_ACADEMIC_GROUP_EXAMPLE,
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
  //   @UseGuards(RolesGuard)
  //   @Roles(SystemRoleSlug.ADMINISTRATOR)
  // @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Get()
  async findAll(@Query() params: QueryDto) {
    // можна додати для пагiнацii але краще повертати весь список ы легше буде вибрати потрiбнi группи для вiдправки повiдомлення --- @Query() params: PaginationDTO
    return await this.academicGroupService.findAll(params);
  }

  @ApiOperation({
    summary:
      'Get academic group by id (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerAcademicGroup.GET_ACADEMIC_GROUP_BY_ID_EXAMPLE,
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
    example: swaggerAcademicGroup.ACADEMIC_GROUP_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.academicGroupService.findOne(id);
  }

  @ApiOperation({
    summary:
      'Update academic group by id (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  // @ApiBody({ type: UpdateAcademicGroupDto })
  @ApiBody({
    schema: {
      example: {
        name: 'em-23',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerAcademicGroup.UPDATE_ACADEMIC_GROUP_EXAMPLE,
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
    example: swaggerAcademicGroup.ACADEMIC_GROUP_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAcademicGroupDto: UpdateAcademicGroupDto,
  ) {
    return this.academicGroupService.update(id, updateAcademicGroupDto);
  }

  @ApiOperation({
    summary:
      'Delete academic group by id (You need to add an administrator access_token or other users who have the required permissions to the cookie)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerAcademicGroup.DELETE_ACADEMIC_GROUP_EXAMPLE,
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
    example: swaggerAcademicGroup.ACADEMIC_GROUP_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicGroupService.remove(id);
  }
}
