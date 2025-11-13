import { FORGOT_PASSWORD_MESSAGE, INVALID_RESET_TOKEN, RESET_TOKEN_EXPIRED, SIGNOUT_SUCCESS_MESSAGE, USER_ALREADY_EXIST, USER_NOT_FOUND } from './auth.constants'

export const SUCCESSFUL_LOGOUT_MESSAGE = "Successful logout"
export const GOOGLE_LOGIN_MESSAGE = "An endpoint for transitioning from a client to sign in or register using a Google account"
export const INCORRECT_EMAIL_OR_PASSWORD_MESSAGE = "Incorrect email or password";
export const FORGOT_PASSWORD_SUCCESS_MESSAGE = "Email with password reset link sent";
export const GENERATE_TOKENS_MESSAGE = "New access_token and refresh_token successfully generated";
export const AUTHORIZATION_SUCCESSFUL_MESSAGE = "Successful user authorization";
export const USER_ALREADY_EXIST_MESSAGE = "User already exists";
export const REGISTRATION_SUCCESSFULLY_MESSAGE = 'User successfully registered returns tokens'
export const GOOGLE_OAUTH_CALLBACK_MESSAGE= "Redirects to the application page adding the token to searchParams 'token'";
export const USER_NOT_FOUND_MESSAGE = "User not found";
export const SIGNOUT_MESSAGE = "Logout (removes refresh token and push subscription)";
export const RESET_TOKEN_HAS_EXPIRED_MESSAGE = "Reset token has expired. Please request a new reset."


export const GOOGLE_OAUTH_AUTHORIZATION = "Google OAuth — authorization initiation";
export const RESET_PASSWORD_USING_TOKEN = "Reset password using token from email"
export const PASSWORD_RESET = "Password reset (sends an email with a link)";
export const UPDATE_TOKENS = "Update access_token and refresh_token";
export const USER_AUTHORIZATION = "User authorization";
export const GOOGLE_OAUTH_CALLBACK = "Google OAuth — callback after authorization";
export const USER_REGISTRATION = "User registration";

export const USER_ALREADY_EXIST_EXAMPLE = {
	message: USER_ALREADY_EXIST,
	error: "Bad Request",
	statusCode: 400
}
export const USER_NOT_FOUND_EXAMPLE = {
	message: USER_NOT_FOUND,
	error: "Not found",
	statusCode: 404
}
export const INVALID_RESET_TOKEN_EXAMPLE = {
	message: INVALID_RESET_TOKEN,
	error: "Not found",
	statusCode: 401
}
export const RESET_TOKEN_EXPIRED_EXAMPLE = {
	message: RESET_TOKEN_EXPIRED,
	error: "Bad request",
	statusCode: 400
}
export const SIGNOUT_SUCCESSFUL_MESSAGE_EXAMPLE = {
	message: SIGNOUT_SUCCESS_MESSAGE
}

export const FORGOT_PASSWORD_SUCCESS_EXAMPLE = {
	message: FORGOT_PASSWORD_MESSAGE
}

export const INCORRECT_EMAIL_OR_PASSWORD_EXAMPLE = {
	message: INCORRECT_EMAIL_OR_PASSWORD_MESSAGE,
	error: "Unauthorized",
	statusCode: 401
}

export const TOKENS_EXAMPLE = {
	access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.f53b28e056b34a199f91.74edbb1b8b01',
	refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.f53b28e056b34a199f91.74edbb1b8b01',
}

export const EMAIL_PASSWORD_EXAMPLE = {
	email: 'user@example.com',
	password: 'StrongPass123!',
}