import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DeviceKeys } from './device-keys.entity';

@Entity()
@Index(['user', 'deviceId'], { unique: true })
export class UserDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, length: 255 })
  deviceId: string;

  @Column({ nullable: true, length: 255 })
  deviceName: string;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => DeviceKeys, (deviceKeys) => deviceKeys.device, {
    cascade: true,
  })
  keys: DeviceKeys;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSeenAt: Date;
}
