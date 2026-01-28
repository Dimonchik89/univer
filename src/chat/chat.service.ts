import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { MoreThan, Repository } from 'typeorm';
import { ChatMember } from './entities/chat-member.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
    @InjectRepository(ChatMember)
    private readonly chatMemberRepo: Repository<ChatMember>,
    @InjectRepository(ChatMessage)
    private readonly messageRepo: Repository<ChatMessage>,
  ) {}

  async checkAccess(userId: string, chatId: string) {
    const member = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        user: { id: userId },
      },
    });

    if (!member) throw new ForbiddenException();
  }

  async sendMessage({
    chatId,
    encryptedText,
    iv,
    userId,
    encryptedKeys,
  }: {
    userId: string;
    chatId: string;
    encryptedText: string;
    iv: string;
    encryptedKeys: Record<string, string>;
  }) {
    await this.checkAccess(userId, chatId);

    if (!encryptedText) {
      throw new BadRequestException('Message is empty');
    }

    if (encryptedText.length > 2000) {
      throw new BadRequestException('Message too long');
    }

    const message = this.messageRepo.create({
      chat: { id: chatId },
      sender: { id: userId },
      encryptedText,
      iv,
      encryptedKeys,
    });
    const createdMessage = await this.messageRepo.save(message);

    const newMessage = await this.messageRepo.findOne({
      where: { id: createdMessage.id },
      relations: {
        sender: true,
      },
      select: {
        id: true,
        encryptedText: true,
        iv: true,
        encryptedKeys: true,
        createdAt: true,
        sender: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    });

    return newMessage;
  }

  //   async getMessages({ userId, chatId }: { userId: string; chatId: string }) {
  //     const member = await this.chatMemberRepo.findOne({
  //       where: { chat: { id: chatId }, user: { id: userId } },
  //     });

  //     if (!member) throw new ForbiddenException();

  //     const lastRead = member.lastReadAt ?? new Date(0);

  //     // 1. Отримуємо 20 повідомлень ДО lastReadAt
  //     const oldMessages = await this.messageRepo
  //       .createQueryBuilder('message')
  //       .leftJoin('message.sender', 'sender')
  //       .addSelect([
  //         'sender.id',
  //         'sender.email',
  //         'sender.firstName',
  //         'sender.lastName',
  //       ])
  //       .where('message.chatId = :chatId', { chatId })
  //       .andWhere('message.createdAt <= :lastRead', { lastRead })
  //       .orderBy('message.createdAt', 'DESC')
  //       .take(20)
  //       .getMany();

  //     // 2. Отримуємо ВСІ (або перші 100) повідомлень ПІСЛЯ lastReadAt
  //     const newMessages = await this.messageRepo
  //       .createQueryBuilder('message')
  //       .leftJoin('message.sender', 'sender')
  //       .addSelect([
  //         'sender.id',
  //         'sender.email',
  //         'sender.firstName',
  //         'sender.lastName',
  //       ])
  //       .where('message.chatId = :chatId', { chatId })
  //       .andWhere('message.createdAt > :lastRead', { lastRead })
  //       .orderBy('message.createdAt', 'ASC')
  //       .take(200) // Обмежимо 200, щоб не "покласти" фронтенд
  //       .getMany();

  //     // Об'єднуємо: oldMessages були DESC, тому їх треба реверснути
  //     const finalMessages = [...oldMessages.reverse(), ...newMessages];

  //     return {
  //       messages: finalMessages,
  //       lastReadAt: member.lastReadAt,
  //     };
  //   }

  async getInitialMessages({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }) {
    const member = await this.chatMemberRepo.findOne({
      where: { chat: { id: chatId }, user: { id: userId } },
    });

    if (!member) throw new ForbiddenException();

    const lastRead = member.lastReadAt ?? new Date(0);

    // 1. Отримуємо 20 повідомлень ДО lastReadAt
    const oldMessages = await this.messageRepo
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .addSelect([
        'sender.id',
        'sender.email',
        'sender.firstName',
        'sender.lastName',
      ])
      .where('message.chatId = :chatId', { chatId })
      .andWhere('message.createdAt <= :lastRead', { lastRead })
      .orderBy('message.createdAt', 'DESC')
      .take(15)
      .getMany();

    // 2. Отримуємо ВСІ (або перші 100) повідомлень ПІСЛЯ lastReadAt
    const newMessages = await this.messageRepo
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .addSelect([
        'sender.id',
        'sender.email',
        'sender.firstName',
        'sender.lastName',
      ])
      .where('message.chatId = :chatId', { chatId })
      .andWhere('message.createdAt > :lastRead', { lastRead })
      .orderBy('message.createdAt', 'ASC')
      .take(15) // Обмежимо 200, щоб не "покласти" фронтенд
      .getMany();

    // Об'єднуємо: oldMessages були DESC, тому їх треба реверснути
    const finalMessages = [...oldMessages.reverse(), ...newMessages];

    return {
      messages: finalMessages,
      lastReadAt: member.lastReadAt,
    };
  }

  async getMessages({
    userId,
    chatId,
    cursor,
    direction = 'before',
  }: {
    userId: string;
    chatId: string;
    cursor?: string;
    direction: 'before' | 'after';
  }) {
    const member = await this.chatMemberRepo.findOne({
      where: { chat: { id: chatId }, user: { id: userId } },
    });
    if (!member) throw new ForbiddenException();

    const query = this.messageRepo
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .addSelect([
        'sender.id',
        'sender.email',
        'sender.firstName',
        'sender.lastName',
      ])
      .where('message.chatId = :chatId', { chatId })
      .take(15); // Стандартна порція для Telegram

    if (cursor) {
      const cursorDate = new Date(cursor);
      if (direction === 'before') {
        cursorDate.setMilliseconds(cursorDate.getMilliseconds() - 1);
        query
          .andWhere('message.createdAt < :cursorDate', { cursorDate })
          .orderBy('message.createdAt', 'DESC');
      } else {
        cursorDate.setMilliseconds(cursorDate.getMilliseconds() + 1);
        query
          .andWhere('message.createdAt > :cursorDate', { cursorDate })
          .orderBy('message.createdAt', 'ASC');
      }
    } else {
      // Якщо курсору немає — завантажуємо "навколо" останнього прочитаного
      // (Логіка, яку ми писали раніше, залишається для початкового входу)
      return await this.getInitialMessages({ userId, chatId });
    }

    const result = await query.getMany();

    console.log('cursor', cursor);
    console.log('new Date', new Date(cursor));
    console.log('result', result);

    // Завжди повертаємо в хронологічному порядку для фронтенду
    // return direction === 'before' ? result.reverse() : result;
    return direction === 'before'
      ? {
          messages: result.reverse(),
          lastReadAt: member.lastReadAt,
        }
      : {
          messages: result,
          lastReadAt: member.lastReadAt,
        };
  }

  async markAsRead(
    userId: string,
    chatId: string,
    lastVisibleMessageId: string,
  ) {
    const message = await this.messageRepo.findOne({
      where: { id: lastVisibleMessageId },
    });

    if (!message) return;

    const result = await this.chatMemberRepo.update(
      {
        user: { id: userId },
        chat: { id: chatId },
      },
      { lastReadAt: message.createdAt },
    );

    return result;

    // if (!result.affected) {
    //   throw new ForbiddenException();
    // }
  }

  async getUserChats(userId: string) {
    const allChats = await this.chatMemberRepo.find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
        chat: {
          academicGroup: true,
        },
      },
      select: {
        id: true,
        joinedAt: true,
        lastReadAt: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
        chat: true,
      },
    });

    if (!allChats) {
      throw new NotFoundException('Чати не знайдено');
    }

    // let res = [];

    // for (const item of allChats) {
    //   const chat = await this.chatRepo.findOne({ where: { id: item.id } });
    // }
    return allChats;
  }

  async findChatUsers(chatId: string) {
    const result = await this.chatMemberRepo
      .createQueryBuilder('chatMember')
      .leftJoin('chatMember.chat', 'chat')
      .leftJoin('chatMember.user', 'user')
      .addSelect(['chat.id', 'user.id', 'user.publicKey'])
      .where('chat.id = :chatId', { chatId })
      .getMany();

    if (!result) {
      throw new NotFoundException('Chat not found');
    }

    return result;
  }
}
