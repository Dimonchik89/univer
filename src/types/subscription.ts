export interface Subscription {
	endpoint: string;
	expirationTime?: any;
	keys: SubscriptionKeys;
}

interface SubscriptionKeys {
	auth: string;
	p256dh: string;
}