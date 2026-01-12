import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
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
import * as swaggerUser from './constants/swagger.user';
import * as swaggerRole from '../role/constants/swagger.role';
import { SearchQueryDto } from './dto/search.query.gto';

@ApiCookieAuth('access_token')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //   @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  //   @Post()
  //   async register(@Body() createUserDto: CreateUserDto) {
  //     const userExist = await this.userService.findByEmail(
  //       createUserDto.email,
  //     );

  //     if (userExist) {
  //       throw new BadRequestException('User already exist');
  //     }
  //     const user = await this.userService.create(createUserDto);

  //     return user;
  //   }

  @ApiOperation({ summary: 'Get user profile. Endpoint for users' })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerUser.GET_USER_PROFILE_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: swaggerUser.CANNOT_GET_THIS_USER_PROFILE_MESSAGE,
    example: swaggerUser.CANNOT_GET_THIS_USER_PROFILE_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerUser.USER_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return await this.userService.findOne({
      userIdFromToken: req.user.id,
      userIdFromParam: id,
    });
  }

  @ApiOperation({
    summary:
      'Get user profile. Endpoint for admins (You need to add an administrator access_token or other users who have the required permissions)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerUser.GET_USER_PROFILE_EXAMPLE,
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
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerUser.USER_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Get('profile-by-admin/:id')
  async findOneByAdmin(@Request() req: any, @Param('id') id: string) {
    return await this.userService.findOneByIdForAdmin(id);
  }

  @ApiOperation({ summary: 'Change user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerUser.GET_USER_PROFILE_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          validationError: {
            summary: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
            value: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
          },
          userIdsDoNotMatch: {
            summary: swaggerUser.CANNOT_GET_THIS_USER_PROFILE_MESSAGE,
            value: swaggerUser.CANNOT_GET_THIS_USER_PROFILE_EXAMPLE,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerUser.USER_NOT_FOUND_EXAMPLE,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // return this.userService.update(id, updateUserDto);
    return await this.userService.update({
      userIdFromToken: req.user.id,
      userIdFromParam: id,
      updateUserDto,
    });
  }

  @ApiOperation({
    summary:
      'Change user profile by admin (You need to add an administrator access_token or other users who have the required permissions)',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerUser.GET_USER_PROFILE_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          validationError: {
            summary: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
            value: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE,
          },
          userIdsDoNotMatch: {
            summary: swaggerUser.CANNOT_GET_THIS_USER_PROFILE_MESSAGE,
            value: swaggerUser.CANNOT_GET_THIS_USER_PROFILE_EXAMPLE,
          },
        },
      },
    },
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
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerUser.USER_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Patch('update-by-admin/:id')
  async updateByAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateByAdmin(id, updateUserDto);
  }

  @ApiOperation({
    summary:
      'Delete user (You need to add an administrator access_token or other users who have the required permissions)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerUser.GET_USER_PROFILE_EXAMPLE,
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
    description: swaggerConstants.NOT_FOUND_MESSAGE,
    example: swaggerRole.ROLE_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(RolesGuard)
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return { message: `User ${id} deleted` };
  }

  @ApiOperation({
    summary:
      'Get all users (You need to add an administrator access_token or other users who have the required permissions)',
  })
  @ApiResponse({
    status: 200,
    description: swaggerConstants.SUCCESSFUL_MESSAGE,
    example: swaggerUser.GET_ALL_USERS_EXAMPLE,
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
  @Get('findAll')
  async findAllTest(@Query() query: SearchQueryDto) {
    return await this.userService.findAllAndSearch(query);
  }

  // @ApiOperation({ summary: "Get users bu role slug (You need to add an administrator access_token or other users who have the required permissions)" })
  // @ApiResponse({
  // 	status: 200,
  // 	description: swaggerConstants.SUCCESSFUL_MESSAGE,
  // 	example: swaggerUser.ROLE_BY_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 401,
  // 	description: swaggerConstants.UNAUTHORIZED_MESSAGE,
  // 	example: swaggerConstants.UNAUTHORIZED_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 403,
  // 	description: swaggerConstants.FORBIDDEN_MESSAGE,
  // 	example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 404,
  // 	description: swaggerRole.ROLE_NOT_FOUND_MESSAGE,
  // 	example: swaggerRole.ROLE_BY_SLUG_NOT_FOUND_EXAMPLE
  // })
  // @UseGuards(RolesGuard)
  // @Roles(SystemRoleSlug.ADMINISTRATOR)
  // @UseGuards(JwtAuthGuard)
  // @Get('role-slug/:slug')
  // async findAllByRoleSlug(@Param('slug') slug: string, @Query() query: QueryDto) {
  // 	return await this.userService.getUsersByRoleSlug(slug, query);
  // }

  // @ApiOperation({ summary: "Get users by role ID (You need to add an administrator access_token or other users who have the required permissions)" })
  // @ApiResponse({
  // 	status: 200,
  // 	description: swaggerConstants.SUCCESSFUL_MESSAGE,
  // 	example: swaggerUser.ROLE_BY_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 401,
  // 	description: swaggerConstants.UNAUTHORIZED_MESSAGE,
  // 	example: swaggerConstants.UNAUTHORIZED_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 403,
  // 	description: swaggerConstants.FORBIDDEN_MESSAGE,
  // 	example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 404,
  // 	description: swaggerRole.ROLE_NOT_FOUND_MESSAGE,
  // 	example: swaggerRole.ROLE_NOT_FOUND_EXAMPLE
  // })
  // @UseGuards(RolesGuard)
  // @Roles(SystemRoleSlug.ADMINISTRATOR)
  // @UseGuards(JwtAuthGuard)
  // @Get('role-id/:id')
  // async findAllByRoleId(@Param('id') id: string, @Query() query: QueryDto) {
  // 	return await this.userService.getUsersByRoleId(id, query);
  // }

  // @ApiOperation({ summary: "Get users by academic group ID (You need to add an administrator access_token or other users who have the required permissions)" })
  // @ApiResponse({
  // 	status: 200,
  // 	description: swaggerConstants.SUCCESSFUL_MESSAGE,
  // 	example: swaggerUser.ROLE_BY_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 401,
  // 	description: swaggerConstants.UNAUTHORIZED_MESSAGE,
  // 	example: swaggerConstants.UNAUTHORIZED_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 403,
  // 	description: swaggerConstants.FORBIDDEN_MESSAGE,
  // 	example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 404,
  // 	description: swaggerGroup.GROUP_BY_ID_NOT_FOUND_MESSAGE,
  // 	example: swaggerGroup.ACADEMIC_GROUP_NOT_FOUND_EXAMPLE
  // })
  // @UseGuards(RolesGuard)
  // @Roles(SystemRoleSlug.ADMINISTRATOR)
  // @UseGuards(JwtAuthGuard)
  // @Get('academic-group-id/:id')
  // async findAllByAcademicGroupId(@Param('id') id: string, @Query() query: QueryDto) {
  // 	return await this.userService.getUsersByAcademicGroupId(id, query);
  // }

  // @ApiOperation({ summary: "Get users by academic group slug (You need to add an administrator access_token or other users who have the required permissions)" })
  // @ApiResponse({
  // 	status: 200,
  // 	description: swaggerConstants.SUCCESSFUL_MESSAGE,
  // 	example: swaggerUser.ROLE_BY_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 401,
  // 	description: swaggerConstants.UNAUTHORIZED_MESSAGE,
  // 	example: swaggerConstants.UNAUTHORIZED_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 403,
  // 	description: swaggerConstants.FORBIDDEN_MESSAGE,
  // 	example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE
  // })
  // @ApiResponse({
  // 	status: 404,
  // 	description: swaggerGroup.GROUP_BY_SLUG_NOT_FOUND_MESSAGE,
  // 	example: swaggerGroup.ACADEMIC_GROUP_BY_SLUG_NOT_FOUND_EXAMPLE
  // })
  // @UseGuards(RolesGuard)
  // @Roles(SystemRoleSlug.ADMINISTRATOR)
  // @UseGuards(JwtAuthGuard)
  // @Get('academic-group-slug/:slug')
  // async findAllByAcademicGroupSlug(@Param('slug') slug: string, @Query() query: QueryDto) {
  // 	return await this.userService.getUsersByAcademicGroupSlug(slug, query);
  // }
}
