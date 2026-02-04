import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChatMember } from './entities/chat-member.entity';
import * as swaggerChat from './constants/swagger.chat';
import * as swaggerConstants from '../common/swagger-constants';
import { GetChatMessageQuery } from './dto/get-chat-message.query.dto';
import { SetLastReadMessageDto } from './dto/set-last-read-message.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { SystemRoleSlug } from '../role/enums/role.enum';
import { AddUserToChatDto } from './dto/add-user-to-chat.dto';
import { PaginationDTO } from '../academic-group/dto/pagination.dto';

@ApiCookieAuth('access_token')
@ApiTags('Сhats')
@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({
    summary: 'Get all chats of a user',
  })
  @ApiResponse({
    status: 200,
    description: swaggerChat.GET_ALL_USER_CHATS_SUCCESS_MESSAGE,
    example: swaggerChat.GET_ALL_USER_CHATS_EXAMPLE,
  })
  @ApiUnauthorizedResponse({
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerChat.USER_CHATS_NOT_FOUND_MESSAGE,
    example: swaggerChat.CHATS_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  getMyChats(@Req() req) {
    return this.chatService.getUserChats(req.user.id);
  }

  @ApiOperation({
    summary: 'Obtaining a token for connecting to a websocket',
  })
  @ApiResponse({
    status: 200,
    description: swaggerChat.GET_TOKEN_SUCCESSFULLY_MESSAGE,
    example: swaggerChat.GET_TOKEN_TO_CONNECT_WEBSOCKET_EXAMPLE,
  })
  @ApiUnauthorizedResponse({
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Get('socket-token')
  async getSocketToken(@Req() req) {
    const token = await this.jwtService.signAsync(
      { sub: req.user.id },
      { expiresIn: '5m' },
    );

    return {
      token,
    };
  }

  @ApiOperation({
    summary: 'Get a set of messages for a specified period of time by chat ID',
  })
  @ApiResponse({
    status: 200,
    description: swaggerChat.MESSAGES_LIST_SUCCESSFULLY_RECEIVED_MESSAGE,
    example: swaggerChat.GET_MESSAGES_LIST_EXAMPLE,
  })
  @ApiUnauthorizedResponse({
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiForbiddenResponse({
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  async getChatMessages(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() { cursor, direction }: GetChatMessageQuery,
    @Req()
    req,
  ) {
    return await this.chatService.getMessages({
      userId: req.user.id,
      chatId: id,
      cursor,
      direction,
    });
  }

  @ApiOperation({
    summary:
      'Endpoint for saving the last message read by the user in the chat by ID',
  })
  @ApiBody({
    type: SetLastReadMessageDto,
  })
  @ApiResponse({
    status: 201,
    description: swaggerChat.SUCCESSFULLY_SET_LAST_READ_MESSAGE,
    example: swaggerChat.SUCCESSFULLY_SET_LAST_READ_MESSAGE_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: swaggerConstants.PROPERTY_SHOULD_NOT_EXIST,
    example: swaggerChat.VALIDATION_PIPE_PROPERTY_EXAMPLE,
  })
  @ApiUnauthorizedResponse({
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  //   @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  async readMessage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
    @Body() body: SetLastReadMessageDto,
  ) {
    return this.chatService.markAsRead(req.user.id, id, body.lastMessageId);
  }

  @ApiOperation({
    summary:
      'The user receives all the chat participants in order to add an object to the message, which will contain an object with the user ID that can decrypt the message as keys and the encrypted key for decrypting this message as a value.',
  })
  @ApiResponse({
    status: 200,
    description: swaggerChat.LIST_CHAT_USERS_RECEIVED_MESSAGE,
    example: swaggerChat.LIST_CHAT_USERS_EXAMPLE,
  })
  @ApiUnauthorizedResponse({
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerChat.USER_CHATS_NOT_FOUND_MESSAGE,
    example: swaggerChat.CHATS_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':chatId/members-with-keys')
  async findChatUsers(@Param('chatId') chatId: string) {
    return this.chatService.findChatUsers(chatId);
  }

  @ApiOperation({
    summary:
      "Endpoint for user exit from chat (you need to add your token to the httponly cookie's access_token)",
  })
  @ApiResponse({
    status: 204,
    description: swaggerChat.SUCCESSFULLY_LEAVE_FROM_CHAT_MESSAGE,
    example: swaggerChat.SUCCESSFULLY_LEAVE_FROM_CHAT_EXAMPLE,
  })
  @ApiUnauthorizedResponse({
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: swaggerChat.USER_CHATS_NOT_FOUND_MESSAGE,
    example: swaggerChat.CHATS_NOT_FOUND_EXAMPLE,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete('leave/:chatId')
  leaveChat(@Param('chatId') chatId: string, @Req() req) {
    return this.chatService.leaveChat(chatId, req.user.id);
  }

  @ApiOperation({
    summary:
      "Endpoint for admin to get the entire chat list (you need to add your admin token to the httponly cookie's access_token",
  })
  @ApiResponse({
    status: 200,
    description: swaggerChat.SUCCESSFUL_GET_ALL_CHATS_FOR_ADMIN_MESSAGE,
    example: swaggerChat.GET_ALL_CHATS_FOR_ADMIN_EXAMPLE,
  })
  @ApiUnauthorizedResponse({
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiForbiddenResponse({
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Get('for-admin')
  getAllChatsByAdmin(@Query() pagination: PaginationDTO) {
    return this.chatService.getAllChatsByAdmin({
      page: +pagination?.page || 1,
      limit: +pagination?.limit || 10,
    });
  }

  @ApiOperation({
    summary: 'Endpoint for admin. Get one chat and all its users',
  })
  @ApiOkResponse({
    description: swaggerChat.SUCCESSFUL_GET_CHAT_INFO_FOR_ADMIN_MESSAGE,
    example: swaggerChat.SUCCESSFULLY_CHAT_AND_ITS_USERS_EXAMPLE,
  })
  @ApiUnauthorizedResponse({
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiForbiddenResponse({
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiNotFoundResponse({
    description: swaggerChat.USER_CHATS_NOT_FOUND_MESSAGE,
    example: swaggerChat.CHAT_NOT_FOUND_EXAMPLE,
  })
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Get('for-admin/:chatId')
  getOneChatAndMembersByAdmin(@Param('chatId') chatId: string) {
    return this.chatService.getOneChatAndMembersByAdmin(chatId);
  }

  //   вот это по факту должен быть Patch потому что кроме добавления и удаления пользователя больше делать неечго, нужно только в addUserToChatByAdmin реализовать удаление пользователя
  @ApiOperation({
    summary:
      'Endpoint for admin. Change the list of chat participants (add or remove)',
  })
  @ApiOkResponse({
    description: 'Users have been successfully added or removed.',
    example: swaggerChat.CHAT_USERS_SUCCESSFULLY_UPDATED_EXAMPLE,
  })
  @ApiUnauthorizedResponse({
    description: swaggerConstants.UNAUTHORIZED_MESSAGE,
    example: swaggerConstants.INVALID_ACCESS_TOKEN_EXAMPLE,
  })
  @ApiForbiddenResponse({
    description: swaggerConstants.FORBIDDEN_MESSAGE,
    example: swaggerConstants.ROLE_FORBIDDEN_EXAMPLE,
  })
  @ApiNotFoundResponse({
    description: swaggerChat.USER_CHATS_NOT_FOUND_MESSAGE,
    example: swaggerChat.CHAT_NOT_FOUND_EXAMPLE,
  })
  @ApiBody({ type: AddUserToChatDto })
  @Roles(SystemRoleSlug.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard)
  @Patch('for-admin/:chatId/add')
  addUserToChatByAdmin(
    @Param('chatId') chatId: string,
    @Body() dto: AddUserToChatDto,
  ) {
    return this.chatService.addUserToChatByAdmin(chatId, dto);
  }
}
