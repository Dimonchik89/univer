import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ScheduleTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '1RUYNNYqR1W9JGryBVfzlDA-glVBjEz_T0sf92ed3Y1M' })
  @Column({ unique: true, nullable: false })
  tableId: string;

  @ApiProperty({ example: 6 })
  @Column({ nullable: false })
  groupRowIndex: number;

  @ApiProperty({
    example:
      '{ "Monday": 5,"Tuesday": 15,"Wednesday": 25,"Thursday": 35,"Friday": 45, "Saturday": 55 }',
  })
  @Column({ nullable: false })
  indexBeginningDaysOfWeekInTable: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
