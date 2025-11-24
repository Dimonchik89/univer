import * as reminderConstants from "./reminder.constants"

export const CREATE_REMINDER_SUMMARY = "Create a reminder (You need to add the user's access_token in a cookie to the request)";
export const DELETE_REMINDED_SUMMARY = "Delete reminder (You need to add the user's access_token in a cookie to the request)";


export const REMINDER_DELETED_MESSAGE = "The reminder has been successfully deleted";
export const REMINDER_CREATED_MESSAGE  = "Reminder created";


export const REMINDER_SUCCESSFULLY_DELETED_EXAMPLE = {
	message: reminderConstants.REMINDER_DELETED,
	success: true
}

export const REMINDER_CREATED_EXAMPLE = {
	message: reminderConstants.REMINDER_CREATED,
	success: true
}


export const NOT_FOUND_EXAMPLE = {
	message: reminderConstants.REMINDER_NOT_FOUND,
	error: "Not Found",
	statusCode: 404
}