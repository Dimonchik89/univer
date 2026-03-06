import { Injectable } from '@nestjs/common';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDevice } from './entities/user-device.entity';
import { Repository } from 'typeorm';
import { DeviceKeys } from './entities/device-keys.entity';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(UserDevice)
    private userDeviceRepository: Repository<UserDevice>,
    @InjectRepository(DeviceKeys)
    private deviceKeysRepository: Repository<DeviceKeys>,
    private readonly chatGateway: ChatGateway,
  ) {}

  async register(userId: string, dto: RegisterDeviceDto) {
    let device = await this.userDeviceRepository.findOne({
      where: { deviceId: dto.deviceId, user: { id: userId } },
      relations: ['keys', 'user'],
    });

    if (device) {
      device.lastSeenAt = new Date();

      if (device.keys) {
        // console.log("device", device);
        // device.keys.publicKey = dto.publicKey;
        // await this.userDeviceRepository.save(device);
      } else {
        const keys = await this.deviceKeysRepository.create({
          publicKey: dto.publicKey,
          device,
        });

        await this.deviceKeysRepository.save(keys);
      }

      return device;
    }

    device = this.userDeviceRepository.create({
      user: { id: userId },
      deviceId: dto.deviceId,
      deviceName: dto.deviceName,
      lastSeenAt: new Date(),
    });

    await this.userDeviceRepository.save(device);

    const keys = this.deviceKeysRepository.create({
      publicKey: dto.publicKey,
      device,
    });
    await this.deviceKeysRepository.save(keys);
    await this.chatGateway.notifyChatsAboutNewDevice(userId);

    return device;
  }
}
