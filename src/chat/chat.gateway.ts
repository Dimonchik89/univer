import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import gatewayHandshakeConfig from './config/gateway-handshake.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMember } from './entities/chat-member.entity';
import { Repository } from 'typeorm';
@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    @Inject(gatewayHandshakeConfig.KEY)
    private gatewayTokenConfig: ConfigType<typeof gatewayHandshakeConfig>,
    @InjectRepository(ChatMember)
    private readonly chatMemberRepo: Repository<ChatMember>,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.use((socket: Socket, next) => {
      const token = socket.handshake.auth?.token;

      if (!token) {
        console.log('Socket auth failed: token missing');
        return next(new Error('Authentication token missing'));
      }

      try {
        const payload = this.jwtService.verify(token, {
          secret: this.gatewayTokenConfig.secret,
        });
        socket.data.userId = payload.sub;

        next();
      } catch (error) {
        console.log('Socket auth failed: invalid token');
        next(new Error('Invalid or expired token'));
      }
    });

    console.log('Socket middleware initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`✅ User connected: ${client.data.userId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    client: Socket,
    data: {
      chatId: string;
      encryptedText: string;
      iv: string;
      encryptedKeys: Record<string, string>;
    },
  ) {
    const userId = client.data.userId;

    const message = await this.chatService.sendMessage({
      userId,
      chatId: data.chatId,
      iv: data.iv,
      encryptedText: data.encryptedText,
      encryptedKeys: data.encryptedKeys,
    });

    console.log('data.chatId', data.chatId);

    this.server.to(data.chatId).emit('new_message', message);
  }

  @SubscribeMessage('join_chat')
  async handleJoin(client: Socket, chatId: string) {
    console.log('join_chat');
    const userId = client.data.userId;

    const prevChatId = client.data?.activeChatId;

    if (prevChatId) {
      client.leave(prevChatId);
      console.log(`User ${userId} left room ${prevChatId}`);
    }

    try {
      await this.chatService.checkAccess(userId, chatId);
      client.join(chatId);
      client.data.activeChatId = chatId;
      console.log(`User ${userId} joined room ${chatId}`);
    } catch (error) {
      console.error('Access denied or chat not found');
      client.emit('error', 'You do not have access to this chat');
    }
  }

  //   @SubscribeMessage('read_chat')
  //   async handleReadChat(client: Socket, chatId: string) {
  //     const userId = client.data.userId;
  //     // await this.chatService.markAsRead(userId, chatId);

  //     // Можна повідомити інших користувачів, що повідомлення прочитане (сірі галочки стануть синіми)
  //     this.server.to(chatId).emit('user_read_messages', { userId, chatId });
  //   }

  //   notifyNewDevice(userId: string) {
  //     this.server.to(`user:${userId}`).emit('user:new-device', {
  //       userId,
  //     });
  //   }

  async notifyChatsAboutNewDevice(userId: string) {
    console.log('notifyChatsAboutNewDevice');

    const chats = await this.chatMemberRepo.find({
      where: {
        user: { id: userId },
      },
      relations: {
        chat: true,
      },
      select: {
        chat: { id: true },
      },
    });

    const chatIds = chats.map((item) => item.chat.id);

    console.log('notifyChatsAboutNewDevice chats', chats);

    for (const chatId of chatIds) {
      console.log(chatId);

      this.server.to(chatId).emit('chat:keys-updated', {
        chatId,
        userId,
      });
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    const chatId = client.data.activeChatId;

    if (chatId) {
      client.leave(chatId);

      // (опционально) уведомляем других нужно добавить на клиенте если необходимо (не уверен что нужно)
      this.server.to(chatId).emit('user_disconnected', {
        userId,
        chatId,
      });
    }

    console.log(`🔴 User ${userId} disconnected (${client.id})`);
    delete client.data.activeChatId;
    delete client.data.userId;
  }
}
