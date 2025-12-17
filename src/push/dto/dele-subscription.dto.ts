import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteSubscriptionDto {
	@ApiProperty({ example: "https://fcm.googleapis.com/fcm/send/cN0abc123XYZ:APA91bH0...D4" })
	@IsString()
	endpoint: string
}