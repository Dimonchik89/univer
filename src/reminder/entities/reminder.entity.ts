import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Event } from '../../event/entities/event.entity';


@Entity('reminder')
@Index(['user', 'event'], { unique: true })
export class Reminder {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, user => user.reminders, { onDelete: "CASCADE" })
	user: User;

	@ManyToOne(() => Event, event => event.reminders, { onDelete: "CASCADE" })
	event: Event;

	@Column({ type: 'timestamp with time zone' })
    reminderTime: Date;

	@Column({ default: false })
    isSent: boolean;
}
