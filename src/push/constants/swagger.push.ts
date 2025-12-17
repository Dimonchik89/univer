import * as pushSubscriptionConstance from "./push-subscription.constants";

 export const CREATE_SUBSCRIPTION_SUMMARY = "Create a subscription (You need to add the user's access_token in a cookie to the request)";
export const DELETE_SUBSCRIPTION_SUMMARY = "Delete subscription (You need to add the user's access_token in a cookie to the request)";

export const SUBSCRIPTION_CREATED_MESSAGE = "The event subscription has been successfully completed";
export const SUBSCRIPTION_DELETED_MESSAGE = "Subscription successfully deleted";
export const NO_SUBSCRIPTION_ENDPOINT_MESSAGE = "The request is missing an endpoint";
export const SUBSCRIPTION_NOT_FOUND_MESSAGE = "Subscription not found";

export const SUBSCRIPTION_CREATED_EXAMPLE = {
	message: pushSubscriptionConstance.SUBSCRIPTION_SUCCESSFULLY_MESSAGE,
	saved: {
		endpoint: "https://fcm.googleapis.com/fcm/send/cN0abc123XYZ:APA91bH0...D4",
		p256dh: "BGH2Y4fZtCXMlZf3nWJpMuHn7heTjdf92xg0EtJz0lI6y4Qvj0vf7n3EZ3U9O1m0fQ0DvY0uT3Y3f7A8k9gFQ=",
		auth: "yXQkJ5m7rQ==",
		expirationTime: null,
	}
}

export const SUBSCRIPTION_DELETED_EXAMPLE = {
	message: pushSubscriptionConstance.SUBSCRIPTION_DELETED_MESSAGE,
}

export const ENDPOINT_IS_REQUIRED_EXAMPLE  = {
	message: pushSubscriptionConstance.ENDPOINT_IS_REQUIRED_MESSAGE,
	error: "Bad Request",
	statusCode: 400
}

export const NOT_FOUND_EXAMPLE = {
	message: pushSubscriptionConstance.SUBSCRIPTION_NOT_FOUND,
	error: "Not Found",
	statusCode: 404
}