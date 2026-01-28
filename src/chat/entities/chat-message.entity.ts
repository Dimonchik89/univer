import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../user/entities/user.entity';

// @Entity('chat_messages')
// export class ChatMessage {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
//   chat: Chat;

//   @ManyToOne(() => User, { onDelete: 'SET NULL' })
//   sender: User;

//   @Column('text')
//   text: string;

//   @CreateDateColumn()
//   createdAt: Date;
// }

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat)
  chat: Chat;

  @ManyToOne(() => User)
  sender: User;

  @Column('text')
  encryptedText: string;

  @Column('text')
  iv: string;

  @Column('jsonb')
  encryptedKeys: Record<string, string>;

  @CreateDateColumn()
  createdAt: Date;
}
