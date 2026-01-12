import {
  COMPLAINT_ROLE_ALREADY_EXIST,
  COMPLAINT_ROLE_NOT_FOUND,
} from './complaint_role.constants';
export const CREATE_COMPLAINT_ROLE_MESSAGE =
  'Successful complaint role creation';

export const COMPLAINT_ROLE_EXAMPLE = {
  name: 'мовний омбудсмен',
  slug: 'movnyy-ombudsmen',
  id: '855eb656-f153-4856-aa53-eda5753b10c8',
  updatedAt: '2026-01-12T08:07:09.457Z',
  createdAt: '2026-01-12T08:07:09.457Z',
  user: {
    id: '0a2ed629-9863-4b6d-ae5a-e3acd4674adf',
    email: 'teacher@gmail.com',
    firstName: null,
    lastName: null,
  },
};

export const COMPLAINT_ROLE_ALREADY_EXIST_EXAMPLE = {
  message: COMPLAINT_ROLE_ALREADY_EXIST,
  error: 'Bad Request',
  statusCode: 400,
};

export const GET_ALL_COMPLAINT_ROLE_EXAMPLE = {
  results: [
    {
      id: '855eb656-f153-4856-aa53-eda5753b10c8',
      name: 'мовний омбудсмен',
      slug: 'movnyy-ombudsmen',
      updatedAt: '2026-01-12T08:07:09.457Z',
      createdAt: '2026-01-12T08:07:09.457Z',
      user: {
        id: '0a2ed629-9863-4b6d-ae5a-e3acd4674adf',
        email: 'teacher@gmail.com',
        firstName: null,
        lastName: null,
      },
    },
    {
      id: '1433f2ba-fb30-457d-9f64-0562791557ce',
      name: 'антикорупціонер',
      slug: 'antykoruptsioner',
      updatedAt: '2026-01-12T08:56:11.187Z',
      createdAt: '2026-01-12T08:56:11.187Z',
    },
  ],
  total: 3,
  limit: 2,
  page: 1,
};

export const COMPLAINT_ROLE_NOT_FOUND_EXAMPLE = {
  message: COMPLAINT_ROLE_NOT_FOUND,
  error: 'Not Found',
  statusCode: 404,
};

export const DELETE_COMPLAINT_ROLE_EXAMPLE = {
  id: '855eb656-f153-4856-aa53-eda5753b10c8',
  success: true,
};
