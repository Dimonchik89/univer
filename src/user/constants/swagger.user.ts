import { CANNOT_GET_THIS_USER_PROFILE } from './user.constants'
import * as swaggerConstants from "../../common/swagger-constants"

export const CANNOT_GET_THIS_USER_PROFILE_MESSAGE = "The ID in the token and the requested user's ID don't match. You can only get your own profile.";



export const CANNOT_GET_THIS_USER_PROFILE_EXAMPLE = {
	message: CANNOT_GET_THIS_USER_PROFILE,
	error: "Bad Request",
	statusCode: 400
}

export const GET_ALL_USERS_EXAMPLE = [
	[
		{
			"id": "6b563693-7312-4932-aba9-b38529772c33",
			"email": "admin@gmail.com",
			"firstName": null,
			"lastName": null,
			"avatarUrl": null,
			"roles": [
				{
					"id": "117aa210-6c73-4870-aafa-d0da0e9997f6",
					"name": "староста",
					"slug": "starosta",
					"updatedAt": "2025-11-04T08:21:43.912Z",
					"createdAt": "2025-11-04T08:21:43.912Z"
				}
			],
			"academic_groups": []
		},
		{
			"id": "cc4c61d4-34e8-2147-8a6e-1b02a5bd28f0",
			"email": "student@gmail.com",
			"firstName": null,
			"lastName": null,
			"avatarUrl": null,
			"roles": [
				{
					"id": "38133de9-149c-4e52-1239-c819405acd00",
					"name": "студент",
					"slug": "student",
					"updatedAt": "2025-11-04T08:21:43.905Z",
					"createdAt": "2025-11-04T08:21:43.905Z"
				}
			],
			"academic_groups": []
		}
	],
	2
]

export const GET_USER_PROFILE_EXAMPLE = {
	"id": "cc4c69d5-04e3-4691-8a6e-0b11a5bd28f0",
	"email": "student@gmail.com",
	"firstName": null,
	"lastName": null,
	"avatarUrl": null,
	"roles": [
		{
			"id": "38159de9-149c-4e52-8176-c819505acd00",
			"name": "студент",
			"slug": "student",
			"updatedAt": "2025-11-04T08:21:43.905Z",
			"createdAt": "2025-11-04T08:21:43.905Z"
		}
	],
	"academic_groups": []
}

export const USER_NOT_FOUND_EXAMPLE = {
	"message": "Користувач не знайдений",
	"error": "Not Found",
	"statusCode": 404
}

export const USER_NOT_FOUND_EXAMPLE_VARIANT = {
	summary: "USER_NOT_FOUND_EXAMPLE_VARIANT",
	value: USER_NOT_FOUND_EXAMPLE
}

export const VALIDATION_PIPE_PROPERTY_EXAMPLE_VARIANT = {
	summary: "VALIDATION_PIPE_PROPERTY_EXAMPLE",
	value: swaggerConstants.VALIDATION_PIPE_PROPERTY_EXAMPLE
}

export const ROLE_BY_EXAMPLE = [
	[
		{
			"id": "e22f78a7-c02b-45fd-9221-dc4ba1b50be0",
			"email": "student2@gmail.com",
			"firstName": "Вася",
			"lastName": "Василькiн",
			"avatarUrl": null,
			"createdAt": "2025-11-07T05:21:59.732Z",
			"roles": [
				{
					"id": "38159de9-149c-4e52-8176-c819505acd00",
					"name": "студент",
					"slug": "student"
				}
			],
			"academic_groups": [
				{
					"id": "28767dda-b84d-4244-b0e4-988454a2942a",
					"name": "мо-24",
					"slug": "mo-24"
				}
			]
		},
		{
			"id": "8a5bb937-130f-462f-853b-3e48aebf05ab",
			"email": "student@gmail.com",
			"firstName": "Yura",
			"lastName": "Пупнкiн",
			"avatarUrl": null,
			"createdAt": "2025-11-06T09:35:45.321Z",
			"roles": [
				{
					"id": "38159de9-149c-4e52-8176-c819505acd00",
					"name": "студент",
					"slug": "student"
				}
			],
			"academic_groups": [
				{
					"id": "3b193b32-7581-4eb7-acea-18b89d5affd4",
					"name": "ЕМ-06",
					"slug": "em-06"
				}
			]
		}
	],
	2
]