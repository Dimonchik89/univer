import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';
import { Role } from '../../role/entities/role.entity';

export class AuthJwtPayload {
  id: string;
  roles: Role[];
  academic_groups: AcademicGroup[]; // додав для можливосты одразу показувати розклад потрыбноъ группи (опцiйно)
}
