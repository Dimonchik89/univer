import {
  SCHEDULE_TABLE_ALREADY_EXIST,
  SCHEDULE_TABLE_NOT_FOUND,
} from './schedule.constants';

export const CREATE_ACADEMIC_GROUP_MESSAGE =
  'Successful schedule table creation';

export const CREATE_SCHEDULE_TABLE_EXAMPLE = {
  createdAt: '2026-03-03T07:03:04.168Z',
  groupRowIndex: 2,
  id: 'a6d06b01-dfc1-4f8a-a4fa-2d0e5872fc45',
  indexBeginningDaysOfWeekInTable:
    '{"Monday":3,"Tuesday":4,"Wednesday":5,"Thursday":6,"Friday":7,"Saturday":7}',
  tableId: '1',
  updatedAt: '2026-03-03T07:03:04.168Z',
};

export const UPDATE_SCHEDULE_TABLE_EXAMPLE = {
  createdAt: '2026-03-03T07:03:04.168Z',
  groupRowIndex: 2,
  id: 'a6d06b01-dfc1-4f8a-a4fa-2d0e5872fc45',
  indexBeginningDaysOfWeekInTable:
    '{"Monday":3,"Tuesday":4,"Wednesday":5,"Thursday":6,"Friday":7,"Saturday":7}',
  tableId: '1',
  updatedAt: '2026-03-03T07:03:04.168Z',
};

export const GET_ALL_SCHEDULE_TABLE_EXAMPLE = {
  results: [
    {
      id: 'dca589f3-a52d-4519-9e0f-178e96ea363b',
      tableId: '1j7KJcPazLt69EVPNF7ncrOyiO2Yv_lyQs5x746Yc7ec',
      groupRowIndex: 6,
      indexBeginningDaysOfWeekInTable:
        '{"Monday":7,"Tuesday":21,"Wednesday":35,"Thursday":49,"Friday":63,"Saturday":null}',
      updatedAt: '2026-02-27T12:02:54.774Z',
      createdAt: '2026-02-27T12:02:54.774Z',
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
};

export const GET_SCHEDULE_TABLE_BY_ID_EXAMPLE = {
  id: 'dca589f3-a52d-4519-9e0f-178e96ea363b',
  tableId: '1j7KJcPazLt69EVPNF7ncrOyiO2Yv_lyQs5x746Yc7ec',
  groupRowIndex: 6,
  indexBeginningDaysOfWeekInTable:
    '{"Monday":7,"Tuesday":21,"Wednesday":35,"Thursday":49,"Friday":63,"Saturday":null}',
  updatedAt: '2026-02-27T12:02:54.774Z',
  createdAt: '2026-02-27T12:02:54.774Z',
};

export const DELETE_SCHEDULE_TABLE_EXAMPLE = {
  id: '855eb656-f153-4856-aa53-eda5753b10c8',
  success: true,
};

export const GET_SCHEDULE_FOR_GROUP_EXAMPLE = {
  tuesday: [
    {
      id: '01261600-4263-48c9-ae51-e33df381281b',
      lesson: 'Математичні методи в економіці та фінансах (л)',
      dayOfWeek: 'tuesday',
      color: 'red',
      lessonNumber: 1,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.871Z',
      updatedAt: '2026-03-03T07:52:22.871Z',
    },
    {
      id: 'a65434a0-ccd3-4ea7-91e5-9b3783d96a1f',
      lesson: 'Математичні методи в економіці та фінансах',
      dayOfWeek: 'tuesday',
      color: 'green',
      lessonNumber: 1,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.873Z',
      updatedAt: '2026-03-03T07:52:22.873Z',
    },
  ],
  monday: [
    {
      id: '9da2eee4-0b6c-4fee-b4ef-73b21bd0bbf5',
      lesson: 'Методологія економічних досліджень (л)',
      dayOfWeek: 'monday',
      color: 'black',
      lessonNumber: 2,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.855Z',
      updatedAt: '2026-03-03T07:52:22.855Z',
    },
    {
      id: 'da2e6247-ffeb-43e3-9803-5f09cb8a71cf',
      lesson: 'Фінансова безпека країни',
      dayOfWeek: 'monday',
      color: 'green',
      lessonNumber: 3,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.863Z',
      updatedAt: '2026-03-03T07:52:22.863Z',
    },
    {
      id: '1c16fcd6-505e-4083-80fe-bd55b92d9b4a',
      lesson: 'Фінансова безпека країни (л)',
      dayOfWeek: 'monday',
      color: 'red',
      lessonNumber: 3,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.861Z',
      updatedAt: '2026-03-03T07:52:22.861Z',
    },
  ],
  wednesday: [
    {
      id: 'b8d48c08-1f00-41ba-94d8-4cd991f01ac2',
      lesson: 'Методологія економічних досліджень',
      dayOfWeek: 'wednesday',
      color: 'black',
      lessonNumber: 2,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.874Z',
      updatedAt: '2026-03-03T07:52:22.874Z',
    },
  ],
  thursday: [
    {
      id: 'e41aabe7-d437-403d-956e-b92a42a9eec9',
      lesson: 'Упр. банк. діял. та регул. ринку страх. послуг (л)',
      dayOfWeek: 'thursday',
      color: 'red',
      lessonNumber: 3,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.876Z',
      updatedAt: '2026-03-03T07:52:22.876Z',
    },
    {
      id: '699a66b3-ae50-4f32-b63d-c537c7c47b59',
      lesson:
        'Управління банківською діяльністю та регулювання ринку страхових послуг',
      dayOfWeek: 'thursday',
      color: 'black',
      lessonNumber: 4,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.877Z',
      updatedAt: '2026-03-03T07:52:22.877Z',
    },
  ],
  friday: [
    {
      id: '54cec4aa-a9ce-44d6-9986-fe1362916bc2',
      lesson: 'Осн. та прагм. бюдж. децентр. (л)',
      dayOfWeek: 'friday',
      color: 'red',
      lessonNumber: 4,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.879Z',
      updatedAt: '2026-03-03T07:52:22.879Z',
    },
    {
      id: 'f2052b59-f9cd-4489-947d-d7c25f33ff80',
      lesson: 'Осн. та прагм. бюдж. децентр. (л)',
      dayOfWeek: 'friday',
      color: 'green',
      lessonNumber: 4,
      lessonType: 'lecture',
      link: null,
      portal: false,
      createdAt: '2026-03-03T07:52:22.880Z',
      updatedAt: '2026-03-03T07:52:22.880Z',
    },
  ],
};

export const PARSE_SCHEDULE_TABLE_EXAMPLE = { message: 'Schedule updated' };

export const SCHEDULE_TABLE_NOT_FOUND_EXAMPLE = {
  message: SCHEDULE_TABLE_NOT_FOUND,
  error: 'Not Found',
  statusCode: 404,
};

export const SCHEDULE_TABLE_ALREADY_EXIST_EXAMPLE = {
  message: SCHEDULE_TABLE_ALREADY_EXIST,
  error: 'Bad Request',
  statusCode: 400,
};
