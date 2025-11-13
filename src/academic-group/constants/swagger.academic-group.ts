import { GROUP_ALREADY_EXIST, GROUP_BY_SLUG_NOT_FOUND, GROUP_NOT_FOUND } from './academic-group.constants'

export const CREATE_ACADEMIC_GROUP_MESSAGE = 'Successful academic group creation'
export const GROUP_BY_ID_NOT_FOUND_MESSAGE = "No academic group with this ID was found"
export const GROUP_BY_SLUG_NOT_FOUND_MESSAGE = "No academic group with this SLUG was found"



export const CREATE_ACADEMIC_GROUP_EXAMPLE = {
	id: "3b193b32-7581-4eb7-acea-18b89d5affd4",
	name: "ем-24",
	slug: "em-24",
	updatedAt: "2025-11-04T08:46:07.687Z",
	createdAt: "2025-11-04T08:46:07.687Z"
}

export const GET_ACADEMIC_GROUP_BY_ID_EXAMPLE = {
	id: "3b193b32-7581-4eb7-acea-18b89d5affd4",
	name: "ем-24",
	slug: "em-24",
	updatedAt: "2025-11-04T08:46:07.687Z",
	createdAt: "2025-11-04T08:46:07.687Z"
}

export const UPDATE_ACADEMIC_GROUP_EXAMPLE = {
	id: "3b193b32-7581-4eb7-acea-18b89d5affd4",
	name: "ем-24",
	slug: "em-24",
	updatedAt: "2025-11-04T08:46:07.687Z",
	createdAt: "2025-11-04T08:46:07.687Z"
}

export const DELETE_ACADEMIC_GROUP_EXAMPLE = {
	raw: [],
	affected: 1
}

export const GET_ALL_ACADEMIC_GROUP_EXAMPLE = [
	{
		id: "3b193b32-7581-4eb7-acea-18b89d5affd4",
		name: "мо-24",
		slug: "mo-24",
		updatedAt: "2025-11-04T08:46:07.687Z",
		createdAt: "2025-11-04T08:46:07.687Z"
	},
	{
		id: "4a557b6b-eb4f-446e-b843-1a1b89fb6b98",
		name: "еm-24",
		slug: "em-24",
		updatedAt: "2025-11-05T05:24:34.160Z",
		createdAt: "2025-11-05T05:24:34.160Z"
	}
]

export const ACADEMIC_GROUP_NOT_FOUND_EXAMPLE = {
	message: GROUP_NOT_FOUND,
	error: "Not Found",
	statusCode: 404
}

export const ACADEMIC_GROUP_BY_SLUG_NOT_FOUND_EXAMPLE = {
	message: GROUP_BY_SLUG_NOT_FOUND,
	error: "Not Found",
	statusCode: 404
}

export const ACADEMIC_GROUP_ALREADY_EXIST_EXAMPLE = {
	message: GROUP_ALREADY_EXIST,
	error: "Bad Request",
	statusCode: 400
}