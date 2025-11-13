import { IsDefined, IsUUID } from 'class-validator';

export class AcademicGroupForCreateMessageDto {
	@IsDefined({ message: "ID группы должно быть определено." })
    @IsUUID('4', { message: "ID группы должно быть корректным UUID." })
    id: string;
}

export class RoleForCreateMessageDto {
	@IsDefined({ message: "ID роли должно быть определено." })
    @IsUUID('4', { message: "ID роли должно быть корректным UUID." })
    id: string;
}