import { IsUUID } from 'class-validator';

export class AcademicGroupAssign {
  @IsUUID()
  id: string;
}
