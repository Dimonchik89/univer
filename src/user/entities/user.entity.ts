import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PushSubscription } from '../../push/entities/push-subscription.entity';
import { Role } from '../../role/entities/role.entity';
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';
import { Reminder } from '../../reminder/entities/reminder.entity';
import { Event } from '../../event/entities/event.entity';
import { ComplaintRole } from '../../complaint_role/entities/complaint_role.entity';

export enum UserRole {
  TEACHER = 'teacher',
  TEACHER_GUARANTOR = 'teacherGuarantor',
  TEACHER_LEADERS = 'teacherLeaders',
  STUDENT = 'student',
  ADMINISTRATOR = 'administrator',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ nullable: true, length: 100 })
  firstName: string | null;

  @Column({ nullable: true, length: 100 })
  lastName: string | null;

  @Column({ length: 255 })
  passwordHash?: string;

  @Column({ nullable: true, length: 255 })
  hashedRefreshToken: string | null;

  @Column({ nullable: true, length: 2048 })
  avatarUrl?: string | null;

  //   @Column({ nullable: true })
  //   course?: number | null; // здксь возможно нужен массив числе, но это не точно, смотря что сюда присвоим

  @Column({ nullable: true, length: 255 })
  resetPasswordToken: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  resetPasswordExpires: Date | null;

  @OneToMany(() => PushSubscription, (sub) => sub.user)
  subscription?: PushSubscription[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Reminder, (reminder) => reminder.user)
  reminders: Reminder[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @ManyToMany(() => AcademicGroup, (academicGroup) => academicGroup.users)
  @JoinTable({
    name: 'user_academic_group',
  })
  academic_groups: AcademicGroup[];

  @OneToMany(() => Event, (event) => event.sender)
  event: Event[];

  @OneToOne(() => ComplaintRole, (role) => role.user)
  complaintRole?: ComplaintRole;
}
