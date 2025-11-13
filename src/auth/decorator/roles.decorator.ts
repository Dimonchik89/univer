import { SetMetadata } from '@nestjs/common';
import { SYSTEM_ROLES } from "../../role/role.seed";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [string, ...string[]]) => SetMetadata(ROLES_KEY, roles) // наш декоратор в який ми будемо педеавати масив классiв яким дозволено доступ (ROLES_KEY - це ключ за яким ми будемо отримувати кролiв нашому створенному RolesGuard)