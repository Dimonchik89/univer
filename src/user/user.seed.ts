import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { User } from './entities/user.entity';

export const SYSTEM_USER: CreateAuthDto[] = [
	{
		email: "admin@gmail.com",
		password: "123456",
		roles: [{ slug: "administrator" }]
	}
]