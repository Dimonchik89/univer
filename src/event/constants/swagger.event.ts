export const NOT_VALID_UUID = "Not a valid UUID";
export const VALIDATION_PIPE_CREATE_EVENT_SUCCESS_MESSAGE = "The event was created successfully.";
export const EVENT_UPDATED_MESSAGE = "The event has been updated."
export const GET_ALL_EVENTS_BY_ROLE_AND_GROUP_MESSAGE = "Get all events by role and group";
export const GET_EVENT_BY_DATE_SUCCESSFULLY_MESSAGE = 'Successfully received array with event dates';
export const INVALID_DATE_MESSAGE = "Date must be a valid ISO 8601 date string";

export const CREATE_EVENT_SUMMARY = "Create Event (You need to add an administrator access_token or other users who have the required permissions)";
export const UPDATE_EVENT_SUMMARY = "Update Event (You need to add an administrator access_token or other users who have the required permissions)";
export const GET_ALL_EVENTS_SUMMARY = "Get all events (You need to add an administrator access_token or other users who have the required permissions)";
export const GET_EVENTS_BY_ROLE_AND_GROUP_SUMMARY = "Get all events by role and group (You need to add the user's access_token in a cookie to the request)"
export const GET_EVENTS_BY_DATE = "Get events by date (You need to add the user's access_token in a cookie to the request)"

export const VALIDATION_PIPE_NOT_VALID_EXAMPLE = {
	message: [
		"academic_groups.0.ID группы должно быть корректным UUID.",
		"roles.0.ID роли должно быть корректным UUID."
	],
	error: "Bad Request",
	statusCode: 400
};

export const VALIDATION_PIPE_CREATE_EVENT_SUCCESS_EXAMPLE = {
	success: true,
	message: 'Сообщение отправлено инициирована рассылка уведомлений.'
};

// export const GET_ALL_EVENTS_BY_ROLE_AND_GROUP_EXAMPLE = [
// 	[
// 		{
// 			"id": "69b4c89f-d1f8-4633-807d-485aa7623b62",
// 			"senderId": "e85bf5e1-cb68-4c54-ab57-a11c5e83da2e",
// 			"title": "Тестовое сообщение студентам eo-06 и учителю 2025-11-27-09:00(7)",
// 			"message": "просто тело сообщения для проверкис колько текста поместиться",
// 			"createdAt": "2025-11-19T06:08:11.838Z"
// 		},
// 		{
// 			"id": "422cf5d1-b51f-44ce-848d-a8b9329167dc",
// 			"senderId": "e85bf5e1-cb68-4c54-ab57-a11c5e83da2e",
// 			"title": "Тестовое сообщение студентам eo-06 и учителю 2025-11-28-09:00(6)",
// 			"message": "просто тело сообщения для проверкис колько текста поместиться",
// 			"createdAt": "2025-11-19T05:31:48.934Z"
// 		},
// 		{
// 			"id": "5b3259ea-ced3-49ef-86d1-11910b05ac4f",
// 			"senderId": "e85bf5e1-cb68-4c54-ab57-a11c5e83da2e",
// 			"title": "Тестовое сообщение студентам eo-06 и учителю 2025-11-29(5)",
// 			"message": "просто тело сообщения для проверкис колько текста поместиться",
// 			"createdAt": "2025-11-17T14:25:30.240Z"
// 		},
// 	],
// 	3
// ]

export const GET_ALL_EVENTS_BY_ROLE_AND_GROUP_EXAMPLE = {
	results: [
		{
			"id": "7169d44d-b4ac-40a1-809e-8815b8f16add",
			"senderId": "14de253d-0d4b-4872-94a7-7fa8d0e29c2b",
			"title": "Тестовое сообщение студентам NOW 2025-12-02-09:00(9)",
			"message": "просто тело сообщения для проверкис колько текста поместиться",
			"scheduledAt": "2025-12-02T09:00:00.000Z",
			"location": "Аудиторiя 1234567",
			"registrationLink": "https://meet.google.com/123",
			"updatedAt": "2025-11-21T08:00:38.059Z",
			"createdAt": "2025-11-21T06:55:09.708Z",
			"roles": [
				{
					"id": "1a29e896-6e18-4c7c-99ed-ee9f2c3c4de8",
					"name": "староста",
					"slug": "starosta",
					"updatedAt": "2025-11-21T06:42:54.746Z",
					"createdAt": "2025-11-21T06:42:54.746Z"
				},
				{
					"id": "34a09f44-e3cb-4bf6-af1b-a4a2f2b7d98d",
					"name": "студент",
					"slug": "student",
					"updatedAt": "2025-11-21T06:42:54.744Z",
					"createdAt": "2025-11-21T06:42:54.744Z"
				}
			],
			"academic_groups": []
		}
	],
	total: 20,
	page: 1,
	limit: 10,
}

export const UPDATE_EVENT_EXAMPLE = {
	"id": "7169d44d-b4ac-40a1-809e-8815b8f16add",
	"senderId": "14de253d-0d4b-4872-94a7-7fa8d0e29c2b",
	"title": "Тестовое сообщение студентам NOW 2025-12-02-09:00(9)",
	"message": "просто тело сообщения для проверкис колько текста поместиться",
	"scheduledAt": "2025-12-02T09:00:00.000Z",
	"location": "Аудиторiя 1234567",
	"registrationLink": "https://meet.google.com/123",
	"updatedAt": "2025-11-21T08:00:38.059Z",
	"createdAt": "2025-11-21T06:55:09.708Z",
	"academic_groups": [],
	"roles": [
		{
			"id": "34a09f44-e3cb-4bf6-af1b-a4a2f2b7d98d",
			"name": "студент",
			"slug": "student",
			"updatedAt": "2025-11-21T06:42:54.744Z",
			"createdAt": "2025-11-21T06:42:54.744Z"
		},
		{
			"id": "1a29e896-6e18-4c7c-99ed-ee9f2c3c4de8",
			"name": "староста",
			"slug": "starosta",
			"updatedAt": "2025-11-21T06:42:54.746Z",
			"createdAt": "2025-11-21T06:42:54.746Z"
		}
	]
}


export const EVENT_BY_MONTH_EXAMPLE = [
	"2025-11-21T16:30:00.000Z",
	"2025-11-22T16:30:00.000Z",
	"2025-11-27T09:00:00.000Z",
	"2025-11-28T09:00:00.000Z",
	"2025-11-29T16:30:00.000Z"
]

export const EVENT_BY_DATE_EXAMPLE = [
	{
		"id": "7169d44d-b4ac-40a1-809e-8815b8f16add",
		"senderId": "14de253d-0d4b-4872-94a7-7fa8d0e29c2b",
		"title": "Тестовое сообщение студентам NOW 2025-12-02-09:00(9)",
		"message": "просто тело сообщения для проверкис колько текста поместиться",
		"scheduledAt": "2025-12-02T09:00:00.000Z",
		"location": "Аудиторiя 1234567",
		"registrationLink": "https://meet.google.com/123",
		"updatedAt": "2025-11-21T08:00:38.059Z",
		"createdAt": "2025-11-21T06:55:09.708Z",
		"roles": [
			{
				"id": "34a09f44-e3cb-4bf6-af1b-a4a2f2b7d98d",
				"name": "студент",
				"slug": "student",
				"updatedAt": "2025-11-21T06:42:54.744Z",
				"createdAt": "2025-11-21T06:42:54.744Z"
			}
		],
		"academic_groups": []
	}
]

export const NOT_VALID_DATE_EXAMPLE = {
	"message": [
		"date must be a valid ISO 8601 date string",
		"month must be a valid ISO 8601 date string"
	],
	"error": "Bad Request",
	"statusCode": 400
}