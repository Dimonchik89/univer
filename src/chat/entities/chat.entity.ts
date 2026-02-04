import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';
import { ChatMember } from './chat-member.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => AcademicGroup, { onDelete: 'CASCADE' })
  @JoinColumn()
  academicGroup: AcademicGroup;

  @OneToMany(() => ChatMember, (chatMember) => chatMember.chat)
  chatMembers: ChatMember[];

  @CreateDateColumn()
  createdAt: Date;
}
