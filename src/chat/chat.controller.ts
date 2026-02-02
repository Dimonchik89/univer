import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatMember } from './entities/chat-member.entity';
import * as swaggerChat from './constants/swagger.chat';
import * as swaggerConstants from '../common/swagger-constants';
import { GetChatMessageQuery } from './dto/get-chat-message.query.dto';
import { SetLastReadMessageDto } from './dto/set-lasr-read-message.dto';

@ApiCookieAuth('access_token')
@ApiTags('chats')
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
  @ApiResponse({
    status: 401,
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
  @ApiResponse({
    status: 401,
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
  @ApiResponse({
    status: 401,
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
  @ApiResponse({
    status: 401,
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
}
