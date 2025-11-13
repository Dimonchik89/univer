import { IsString } from 'class-validator';

export class DeleteSubscriptionDto {
	@IsString()
	endpoint: string
}