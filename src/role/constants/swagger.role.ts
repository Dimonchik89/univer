import { ROLE_ALREADY_EXIST } from './role.constants';

export const ROLE_NOT_FOUND_MESSAGE = "Role not found";

export const CREATE_ROLE_SUMMARY = "Create New role (You need to add an administrator access_token or other users who have the required permissions)"
export const GET_ALL_ROLES_SUMMARY = "Get all roles and quantity (You need to add an administrator access_token or other users who have the required permissions)"
export const GET_ROLE_BY_ID_SUMMARY = "Get role by ID (You need to add an administrator access_token or other users who have the required permissions)"
export const UPDATE_ROLE_BY_ID_SUMMARY = "Update role name by ID (You need to add an administrator access_token or other users who have the required permissions)"

export const ROLE_ALREADY_EXIST_EXAMPLE = {
	message: ROLE_ALREADY_EXIST,
	error: "Bad Request",
	statusCode: 400
}

export const ROLE_SUCCESS_EXAMPLE = {
	name: "Супер Студент",
	slug: "super-student",
	id: "ea7d9819-41cb-4547-b861-2417bb8bc3",
	createdAt: "2025-10-31T06:24:56.572Z"
}
export const CREATE_ROLE_BODY_EXAMPLE = {
	name: "Студент"
}
export const GET_ALL_ROLE_EXAMPLE = [
	[
		{
			"id": "617c021c-28a0-48de-9b3a-97daf00f5",
			"name": "студент",
			"slug": "student",
			"createdAt": "2025-10-31T05:30:10.401Z"
		},
		{
			"id": "3469df6d-c44f-48ce-9f6e-81f4a0993b",
			"name": "староста",
			"slug": "starosta",
			"createdAt": "2025-10-31T05:30:10.402Z"
		},
	],
	2
]
export const GET_ROLE_BY_ID_EXAMPLE = {
	id: "617c021c-28a0-48de-9b3a-97daf00f5",
	name: "студент",
	slug: "student",
	createdAt: "2025-10-31T05:30:10.401Z"
}
export const ROLE_NOT_FOUND_EXAMPLE = {
	message: "Роль з таким id не знайдено",
	error: "Not Found",
	statusCode: 404
}
export const ROLE_BY_SLUG_NOT_FOUND_EXAMPLE = {
	message: "Роль з таким slug не знайдено",
	error: "Not Found",
	statusCode: 404
}

export const ROLE_DELETED_SUCCESS_EXAMPLE = {
	raw: [],
	affected: 1
}