import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorator/roles.decorator';
import { Repository } from 'typeorm';
import { Role } from '../../../role/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		@InjectRepository(Role) private roleRepository: Repository<Role>
	) {}

	async canActivate(
		context: ExecutionContext,
	): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]) // Отримужмо ролi (масив, це налаштували в декораторi) зi створенного нами декоратору Roles()

		const user = context.switchToHttp().getRequest().user; // отримуэмо даннi на основi @UseGuards(JwtAuthGuard), вiн перевiрить токен i якщо дiйсний то передеасть з нього розкодований id i roles (ми самi додали iх в токен) i передаэмо в req.user. ось тут ми цей req.user i отримаэмо (для цього @UseGuards(JwtAuthGuard) повинен бути нижче нiж @UseGuards(RolesGuard) @Roles(SystemRoleSlug.ADMINISTRATOR) )
		const rolesPromises = requiredRoles.map(async (slug) => {
			return await this.roleRepository.findOne({ where: { slug }})
		})
		const allRolesFromDB = await Promise.all(rolesPromises)

		const hasRequiredRole = allRolesFromDB.some(
			({ id }) => user?.roles?.find(({ id: userRoleId }) => id === userRoleId)) // Проходимось мо масиву ролей i шукаэмо чи э в масивi ролей отримаших з токена хочаб одна id якоi вiдповыдаэ дозволенiй ролi

		return hasRequiredRole;
	}
}

