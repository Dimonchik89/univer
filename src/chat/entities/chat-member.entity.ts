import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../user/entities/user.entity';

@Entity('chat_members')
@Unique(['chat', 'user'])
export class ChatMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  chat: Chat;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamp', nullable: true })
  lastReadAt: Date;

  @CreateDateColumn()
  joinedAt: Date;
}
