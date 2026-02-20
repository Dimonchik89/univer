import { Module } from '@nestjs/common';
import { deviceController } from './device.controller';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevice } from './entities/user-device.entity';
import { DeviceKeys } from './entities/device-keys.entity';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserDevice, DeviceKeys]), ChatModule],
  controllers: [deviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
