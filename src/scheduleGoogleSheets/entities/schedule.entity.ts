import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';
import { WeekDay } from '../../types/schedule';

@Entity('schedule_lessons')
export class ScheduleLesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lesson: string;

  @Column({
    type: 'enum',
    enum: WeekDay,
  })
  dayOfWeek: WeekDay;

  @Column()
  color: string;

  @Column()
  lessonNumber: number;

  @Column()
  lessonType: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  portal: boolean;

  @ManyToOne(() => AcademicGroup, (academicGroup) => academicGroup.schedule, {
    onDelete: 'CASCADE',
  })
  academicGroup: AcademicGroup;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
