class SubscriptionKeys {
	auth: string;
	p256dh: string;
}

class Subscription {
	endpoint: string;
	expirationTime: any;
	keys: SubscriptionKeys;
}

export default class CreateSubscriptionDto extends Subscription {
	id: string
}


