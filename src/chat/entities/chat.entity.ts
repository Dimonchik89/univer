import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => AcademicGroup, { onDelete: 'CASCADE' })
  @JoinColumn()
  academicGroup: AcademicGroup;

  @CreateDateColumn()
  createdAt: Date;
}
