import { EVENT_NOT_FOUND } from './event.constants';

export const NOT_VALID_UUID = 'Not a valid UUID';
export const VALIDATION_PIPE_CREATE_EVENT_SUCCESS_MESSAGE =
  'The event was created successfully.';
export const EVENT_UPDATED_MESSAGE = 'The event has been updated.';
export const GET_ALL_EVENTS_BY_ROLE_AND_GROUP_MESSAGE =
  'Get all events by role and group';
export const GET_EVENT_BY_DATE_SUCCESSFULLY_MESSAGE =
  'Successfully received array with event dates';
export const INVALID_DATE_MESSAGE = 'Date must be a valid ISO 8601 date string';
export const GET_ONE_EVENT_MESSAGE = 'Event data successfully received.';
export const EVENT_BY_ID_NOT_FOUND_MESSAGE = 'No event with this ID was found.';
export const EVENT_DELETED_MESSAGE = 'Event successfully deleted';

export const CREATE_EVENT_SUMMARY =
  'Create Event (You need to add an administrator access_token or other users who have the required permissions)';
export const UPDATE_EVENT_SUMMARY =
  'Update Event (You need to add an administrator access_token or other users who have the required permissions)';
export const GET_ALL_EVENTS_SUMMARY =
  'Get all events (You need to add an administrator access_token or other users who have the required permissions)';
export const GET_EVENTS_BY_ROLE_AND_GROUP_SUMMARY =
  "Get all events by role and group (You need to add the user's access_token in a cookie to the request)";
export const GET_EVENTS_BY_DATE =
  "Get events by date (You need to add the user's access_token in a cookie to the request)";
export const GET_ONE_EVENT_BY_ID_SUMMARY =
  'Endpoint for admin. Get detailed information about an event by ID';
export const DELETE_EVENT_BY_ID_SUMMARY = 'Delete event by ID';

export const VALIDATION_PIPE_NOT_VALID_EXAMPLE = {
  message: [
    'academic_groups.0.ID группы должно быть корректным UUID.',
    'roles.0.ID роли должно быть корректным UUID.',
  ],
  error: 'Bad Request',
  statusCode: 400,
};

export const VALIDATION_PIPE_CREATE_EVENT_SUCCESS_EXAMPLE = {
  success: true,
  message: 'Сообщение отправлено инициирована рассылка уведомлений.',
};

export const EVENT_DELETED_EXAMPLE = {
  raw: [],
  affected: 1,
};

export const EVENT_NOT_FOUND_EXAMPLE = {
  message: EVENT_NOT_FOUND,
  error: 'Not found',
  statusCode: 404,
};

export const GET_ONE_EVENT_EXAMPLE = {
  id: '7169d44d-b4ac-40a1-809e-8815b8f16add',
  sender: {
    email: 'test@gmail.com',
    firstName: 'Дмитро',
    lastName: 'Прізвище',
  },
  title: 'Тестовое сообщение студентам NOW 2025-12-02-09:00(9)',
  message: 'просто тело сообщения для проверкис колько текста поместиться',
  scheduledAt: '2025-12-02T09:00:00.000Z',
  location: 'Аудиторiя 1234567',
  registrationLink: 'https://meet.google.com/123',
  updatedAt: '2025-11-21T08:00:38.059Z',
  createdAt: '2025-11-21T06:55:09.708Z',
  roles: [
    {
      id: '1a29e896-6e18-4c7c-99ed-ee9f2c3c4de8',
      name: 'староста',
      slug: 'starosta',
      updatedAt: '2025-11-21T06:42:54.746Z',
      createdAt: '2025-11-21T06:42:54.746Z',
    },
    {
      id: '34a09f44-e3cb-4bf6-af1b-a4a2f2b7d98d',
      name: 'студент',
      slug: 'student',
      updatedAt: '2025-11-21T06:42:54.744Z',
      createdAt: '2025-11-21T06:42:54.744Z',
    },
  ],
  academic_groups: [
    {
      createdAt: '2025-12-17T06:41:20.569Z',
      id: 'cabf64b9-1308-421b-805f-657c9d5d2e95',
      name: 'мо-24',
      slug: 'mo-24',
      updatedAt: '2025-12-17T06:41:20.569Z',
    },
  ],
};

export const GET_ALL_EVENTS_BY_ROLE_AND_GROUP_EXAMPLE = {
  results: [
    {
      id: '7169d44d-b4ac-40a1-809e-8815b8f16add',
      sender: {
        email: 'test@gmail.com',
        firstName: 'Дмитро',
        lastName: 'Прізвище',
      },
      title: 'Тестовое сообщение студентам NOW 2025-12-02-09:00(9)',
      message: 'просто тело сообщения для проверкис колько текста поместиться',
      scheduledAt: '2025-12-02T09:00:00.000Z',
      location: 'Аудиторiя 1234567',
      registrationLink: 'https://meet.google.com/123',
      updatedAt: '2025-11-21T08:00:38.059Z',
      createdAt: '2025-11-21T06:55:09.708Z',
      roles: [
        {
          id: '1a29e896-6e18-4c7c-99ed-ee9f2c3c4de8',
          name: 'староста',
          slug: 'starosta',
          updatedAt: '2025-11-21T06:42:54.746Z',
          createdAt: '2025-11-21T06:42:54.746Z',
        },
        {
          id: '34a09f44-e3cb-4bf6-af1b-a4a2f2b7d98d',
          name: 'студент',
          slug: 'student',
          updatedAt: '2025-11-21T06:42:54.744Z',
          createdAt: '2025-11-21T06:42:54.744Z',
        },
      ],
      academic_groups: [],
    },
  ],
  total: 20,
  page: 1,
  limit: 10,
};

export const UPDATE_EVENT_EXAMPLE = {
  id: '7169d44d-b4ac-40a1-809e-8815b8f16add',
  sender: {
    email: 'test@gmail.com',
    firstName: 'Дмитро',
    lastName: 'Прізвище',
  },
  title: 'Тестовое сообщение студентам NOW 2025-12-02-09:00(9)',
  message: 'просто тело сообщения для проверкис колько текста поместиться',
  scheduledAt: '2025-12-02T09:00:00.000Z',
  location: 'Аудиторiя 1234567',
  registrationLink: 'https://meet.google.com/123',
  updatedAt: '2025-11-21T08:00:38.059Z',
  createdAt: '2025-11-21T06:55:09.708Z',
  academic_groups: [],
  roles: [
    {
      id: '34a09f44-e3cb-4bf6-af1b-a4a2f2b7d98d',
      name: 'студент',
      slug: 'student',
      updatedAt: '2025-11-21T06:42:54.744Z',
      createdAt: '2025-11-21T06:42:54.744Z',
    },
    {
      id: '1a29e896-6e18-4c7c-99ed-ee9f2c3c4de8',
      name: 'староста',
      slug: 'starosta',
      updatedAt: '2025-11-21T06:42:54.746Z',
      createdAt: '2025-11-21T06:42:54.746Z',
    },
  ],
};

export const EVENT_BY_MONTH_EXAMPLE = [
  '2025-11-21T16:30:00.000Z',
  '2025-11-22T16:30:00.000Z',
  '2025-11-27T09:00:00.000Z',
  '2025-11-28T09:00:00.000Z',
  '2025-11-29T16:30:00.000Z',
];

export const EVENT_BY_DATE_EXAMPLE = [
  {
    id: '7169d44d-b4ac-40a1-809e-8815b8f16add',
    sender: {
      email: 'test@gmail.com',
      firstName: 'Дмитро',
      lastName: 'Прізвище',
    },
    title: 'Тестовое сообщение студентам NOW 2025-12-02-09:00(9)',
    message: 'просто тело сообщения для проверкис колько текста поместиться',
    scheduledAt: '2025-12-02T09:00:00.000Z',
    location: 'Аудиторiя 1234567',
    registrationLink: 'https://meet.google.com/123',
    updatedAt: '2025-11-21T08:00:38.059Z',
    createdAt: '2025-11-21T06:55:09.708Z',
    roles: [
      {
        id: '34a09f44-e3cb-4bf6-af1b-a4a2f2b7d98d',
        name: 'студент',
        slug: 'student',
        updatedAt: '2025-11-21T06:42:54.744Z',
        createdAt: '2025-11-21T06:42:54.744Z',
      },
    ],
    academic_groups: [],
  },
];

export const NOT_VALID_DATE_EXAMPLE = {
  message: [
    'date must be a valid ISO 8601 date string',
    'month must be a valid ISO 8601 date string',
  ],
  error: 'Bad Request',
  statusCode: 400,
};
