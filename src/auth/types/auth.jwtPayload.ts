import { Role } from '../../role/entities/role.entity';

export class AuthJwtPayload {
	id: string;
	roles: Role[]
}