import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';
import { Reminder } from '../../reminder/entities/reminder.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.event, { onDelete: 'CASCADE' })
  sender: User;

  @Column({ length: 255 })
  title: string;

  @Column({ nullable: true, type: 'text' })
  message: string;

  @Column({ type: 'timestamp with time zone' })
  scheduledAt: Date;

  @Column({ nullable: true, length: 255 })
  location: string;

  @Column({ nullable: true, length: 2048 })
  registrationLink: string;

  @OneToMany(() => Reminder, (reminder) => reminder.event)
  reminders: Reminder[];

  @ManyToMany(() => Role, (role) => role.events, { onDelete: 'CASCADE' })
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => AcademicGroup, (academicGroup) => academicGroup.events, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  academic_groups: AcademicGroup[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
