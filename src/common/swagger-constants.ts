export const INVALID_REFRESH_TOKEN = "Invalid refresh_token";
export const INVALID_ACCESS_TOKEN = "Invalid access_token";
export const EXAMPLE_REQUEST = "Example request";
export const SUCCESSFUL_MESSAGE = 'Successful'
export const NOT_FOUND_MESSAGE = "Not found"
export const ALREADY_EXIST_MESSAGE = 'Already exist';
export const PROPERTY_SHOULD_NOT_EXIST = "Property should not exist";

export const UNAUTHORIZED_EXAMPLE= {
	message: "Unauthorized",
	statusCode: 401
}

export const VALIDATION_PIPE_PROPERTY_EXAMPLE = {
	message: [
		"property city should not exist",
		"password must be longer than or equal to 6 characters",
		"password must be a string"
	],
	error: "Bad Request",
	statusCode: 400
}

export const HEADER_REFRESH_TOKEN_EXAMPLE = {
	name: 'Authorization',
	description: 'refresh_token format Bearer <token>',
	example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
}
export const HEADER_ACCESS_TOKEN_EXAMPLE = {
	name: 'Authorization',
	description: 'access_token format Bearer <token>',
	example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
}
export const INVALID_REFRESH_TOKEN_EXAMPLE = {
	message: INVALID_REFRESH_TOKEN,
	error: "Unauthorized",
	statusCode: 401
}
export const INVALID_ACCESS_TOKEN_EXAMPLE = {
	message: INVALID_ACCESS_TOKEN,
	error: "Unauthorized",
	statusCode: 401
}

export const FORBIDDEN_MESSAGE = "Forbidden — user does not have permission to access";
export const UNAUTHORIZED_MESSAGE = 'Unauthorized — access token is missing or invalid';

export const ROLE_FORBIDDEN_EXAMPLE = {
	message: "Forbidden resource",
	error: "Forbidden",
	statusCode: 403
}

export const DELETE_USER_EXAMPLE = {
	"raw": [],
	"affected": 1
}