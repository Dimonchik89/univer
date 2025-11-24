import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';
import { Reminder } from '../../reminder/entities/reminder.entity';

@Entity()
export class Event {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	senderId: string;

	@Column()
	title: string;

	@Column({ nullable: true })
	message: string;

	@Column({ type: 'timestamp with time zone' })
    scheduledAt: Date;

	@Column({ nullable: true })
	location: string;

	@Column({ nullable: true })
	registrationLink: string;

	@OneToMany(() => Reminder, reminder => reminder.event)
	reminders: Reminder[];

	@ManyToMany(() => Role, role => role.events, { onDelete: "CASCADE" })
	@JoinTable()
	roles: Role[];

	@ManyToMany(() => AcademicGroup, academicGroup => academicGroup.events, { onDelete: "CASCADE" })
	@JoinTable()
	academic_groups: AcademicGroup[];

	@UpdateDateColumn()
	updatedAt: Date;

	@CreateDateColumn()
	createdAt: Date;
}
