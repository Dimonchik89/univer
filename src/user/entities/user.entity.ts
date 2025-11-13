import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PushSubscription } from '../../push/entities/push-subscription.entity';
import { Role } from '../../role/entities/role.entity';
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';

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

	@Column()
	email: string;

	@Column({ nullable: true })
	firstName: string | null;

	@Column({ nullable: true })
	lastName: string | null;

	@Column()
	passwordHash?: string;

	@Column({ nullable: true })
	hashedRefreshToken: string | null;

	@Column({ nullable: true })
	avatarUrl?: string | null;

//   @Column({ nullable: true })
//   course?: number | null; // здксь возможно нужен массив числе, но это не точно, смотря что сюда присвоим

	@Column({ nullable: true })
	resetPasswordToken: string | null;

	@Column({ nullable: true, type: 'timestamp' })
	resetPasswordExpires: Date | null;

	@OneToMany(() => PushSubscription, (sub) => sub.user)
	subscription?: PushSubscription[];

	@UpdateDateColumn()
	updatedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

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
}
