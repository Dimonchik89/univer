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
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyChats(@Req() req) {
    return this.chatService.getUserChats(req.user.id);
  }

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

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  async getChatMessages(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('cursor') cursor: string | undefined,
    @Query('direction') direction: 'before' | 'after' | undefined,
    @Req()
    req,
  ) {
    // return await this.chatService.getMessages({
    //   userId: req.user.id,
    //   chatId: id,
    // });

    return await this.chatService.getMessages({
      userId: req.user.id,
      chatId: id,
      cursor,
      direction,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  async readMessage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
    @Body() body: { lastMessageId: string },
  ) {
    return this.chatService.markAsRead(req.user.id, id, body.lastMessageId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':chatId/members-with-keys')
  async findChatUsers(@Param('chatId') chatId: string) {
    return this.chatService.findChatUsers(chatId);
  }
}
