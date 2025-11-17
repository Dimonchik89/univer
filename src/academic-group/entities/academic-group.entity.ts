import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from '../../message/entities/message.entity';
import { Event } from '../../event/entities/event.entity';

@Entity()
export class AcademicGroup {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	name: string;

	@Column({ unique: true })
	slug: string;

	@UpdateDateColumn()
	updatedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToMany(() => User, (user) => user.academic_groups)
	users: User[];

	@ManyToMany(() => Message, message => message.academic_groups)
	@JoinTable()
	messages: Message[];

	@ManyToMany(() => Event, event => event.academic_groups)
	events: Event[];

	@BeforeInsert()
	@BeforeUpdate()
	generateSlug() {
		if (this.name) {
		this.slug = slugify(this.name, {
			lower: true,
			strict: true,
			locale: 'uk',
		});
		}
	}
}
