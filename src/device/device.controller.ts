import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/hwt-auth.guard';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { DeviceService } from './device.service';

@Controller('devices')
export class deviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async registerDevice(@Body() dto: RegisterDeviceDto, @Req() req) {
    return this.deviceService.register(req.user.id, dto);
  }
}
