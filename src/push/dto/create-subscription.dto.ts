import { ApiProperty } from '@nestjs/swagger';

class SubscriptionKeys {
	@ApiProperty({ example: "yXQkJ5m7rQ==" })
	auth: string;

	@ApiProperty({ example: "BGH2Y4fZtCXMlZf3nWJpMuHn7heTjdf92xg0EtJz0lI6y4Qvj0vf7n3EZ3U9O1m0fQ0DvY0uT3Y3f7A8k9gFQ=" })
	p256dh: string;
}

class Subscription {
	@ApiProperty({ example: "https://fcm.googleapis.com/fcm/send/cN0abc123XYZ:APA91bH0...D4" })
	endpoint: string;

	@ApiProperty({ example: null })
	expirationTime: any;

	@ApiProperty()
	keys: SubscriptionKeys;
}

export default class CreateSubscriptionDto extends Subscription {
	// id: string
}


