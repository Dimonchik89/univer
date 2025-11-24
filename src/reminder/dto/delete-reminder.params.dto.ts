import { ApiProperty } from '@nestjs/swagger';

export class DeleteReminderParamsDto {
	@ApiProperty({ example: "6da43dff-1250-4c7d-9230-18d6420131a8" })
	id: string;
}