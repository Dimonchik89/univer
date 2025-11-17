import { DataSource } from 'typeorm';
import dataSource from '../data-source';
import { AuthService } from '../auth/auth.service'; // Или создайте UserService
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { SYSTEM_ROLES } from '../role/role.seed';
import { SYSTEM_USER } from '../user/user.seed';
import { genSalt, hash } from 'bcryptjs';


// Вам нужно будет инициализировать зависимости здесь или создать UserService
// ...

async function runSeed() {
    // 1. Инициализация подключения к БД
    await dataSource.initialize();

    // 2. Получение репозиториев
    const roleRepository = dataSource.getRepository(Role);
    const userRepository = dataSource.getRepository(User);

	await seedSystemRoles(roleRepository);
    await onSeedSystemUser(userRepository, roleRepository)

    await dataSource.destroy();
    console.log('Seeding complete.');
}

runSeed().catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
});


async function seedSystemRoles(roleRepository) {
	console.log('Seeding roles...');
    for(const roleData of SYSTEM_ROLES) {
        const existingRole = await roleRepository.findOne({ where: { name: roleData.name }});
        if(!existingRole) {
            const newRole = roleRepository.create(roleData);
            await roleRepository.save(newRole);
        }
    }
}


async function onSeedSystemUser(userRepository, roleRepository) {
	console.log('Seeding system user...');
	for(const dataUser of SYSTEM_USER) {
        const userExisting = await userRepository.findOne({ where: { email: dataUser.email }});

        if(!userExisting) {
            const role = await roleRepository.findOne({ where: { slug: dataUser.roles[0]?.slug }})
			const { roles, ...tailUser } = dataUser;
			const salt = await genSalt(10);
			const hashedPassword = await hash(dataUser.password, salt);

			const user = await userRepository.create({
				...tailUser,
				email: dataUser.email,
				passwordHash: hashedPassword,
				roles: [{ id: role.id }],
			});

			await userRepository.save(user);
        }
    }
}