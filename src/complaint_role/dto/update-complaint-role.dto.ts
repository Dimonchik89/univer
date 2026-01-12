import { PartialType } from '@nestjs/mapped-types';
import { CreateComplaintRoleDto } from './create-complaint-role.dto';

export class UpdateComplaintRole extends PartialType(CreateComplaintRoleDto) {}
