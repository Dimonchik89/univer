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
import slugify from 'slugify';
import { Message } from '../../message/entities/message.entity';
import { Event } from '../../event/entities/event.entity';

@Entity()
export class Role {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	name: string;

	@Column({ unique: true, nullable: true })
	slug: string;

	@UpdateDateColumn()
	updatedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToMany(() => User, (user) => user.roles)
	users: User[];

	@ManyToMany(() => Message, message => message.roles)
	@JoinTable()
	messages: Message[];

	@ManyToMany(() => Event, event => event.roles)
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
