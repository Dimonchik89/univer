import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';

@Entity()
export class Message {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	senderId: string;

	@Column()
	title: string;

	@Column()
	message: string;

	@ManyToMany(() => Role, role => role.messages)
	roles: Role[]

	@ManyToMany(() => AcademicGroup, academicGroup => academicGroup.messages)
	academic_groups: AcademicGroup[]

	@UpdateDateColumn()
	updatedAt: Date;

	@CreateDateColumn()
	createdAt: Date;
}