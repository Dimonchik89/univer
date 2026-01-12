import { Module } from '@nestjs/common';
import { ComplaintRoleController } from './complaint_role.controller';
import { ComplaintRoleService } from './complaint_role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintRole } from './entities/complaint_role.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintRole, Role])],
  controllers: [ComplaintRoleController],
  providers: [ComplaintRoleService],
})
export class ComplaintRoleModule {}
