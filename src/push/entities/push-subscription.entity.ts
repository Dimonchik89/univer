import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class PushSubscription {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	// @Column({ type: "jsonb" })
	// subscriptionData: any;
	@Column()
	endpoint: string;

	@Column()
	p256dh: string;

	@Column()
	auth: string;

	@Column({ nullable: true })
	expirationTime: string

	@UpdateDateColumn()
	updatedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (user) => user.subscription)
	user: User
}