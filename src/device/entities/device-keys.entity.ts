import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDevice } from './user-device.entity';

@Entity()
export class DeviceKeys {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  publicKey: string;

  @OneToOne(() => UserDevice, (userDevice) => userDevice.keys, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  device: UserDevice;
}
