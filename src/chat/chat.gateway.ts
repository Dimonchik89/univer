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

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log('handleConnection');

    const token = client.handshake.auth?.token;
    if (!token) {
      return client.disconnect();
    }

    try {
      const payload = this.jwtService.verify(token);

      if (!payload?.sub) {
        return client.disconnect();
      }

      client.data.userId = payload.sub;
      client.data.activeChatId = null;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    client: Socket,
    data: { chatId: string; text: string },
  ) {
    console.log('send_message');

    const userId = client.data.userId;

    const message = await this.chatService.sendMessage(
      // добавить возврат пользователя
      userId,
      data.chatId,
      data.text,
    );

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

  @SubscribeMessage('read_chat')
  async handleReadChat(client: Socket, chatId: string) {
    const userId = client.data.userId;
    // await this.chatService.markAsRead(userId, chatId);

    // Можна повідомити інших користувачів, що повідомлення прочитане (сірі галочки стануть синіми)
    this.server.to(chatId).emit('user_read_messages', { userId, chatId });
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    const chatId = client.data.activeChatId;

    if (chatId) {
      client.leave(chatId);

      // 🔔 (опционально) уведомляем других нужно добавить на клиенте если необходимо (не уверен что нужно)
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
