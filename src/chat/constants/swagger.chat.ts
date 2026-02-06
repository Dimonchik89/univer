import { CHATS_NOT_FOUND, CHAT_NOT_FOUND } from './chat.constants';

export const GET_ALL_USER_CHATS_SUCCESS_MESSAGE =
  'Success, all user chats retrieved';
export const USER_CHATS_NOT_FOUND_MESSAGE = 'No user chats found';
export const GET_TOKEN_SUCCESSFULLY_MESSAGE = 'Token successfully received';
export const MESSAGES_LIST_SUCCESSFULLY_RECEIVED_MESSAGE =
  'The message list has been successfully received.';
export const SUCCESSFULLY_SET_LAST_READ_MESSAGE =
  'Successfully set the last read message for a user in a chat';
export const LIST_CHAT_USERS_RECEIVED_MESSAGE =
  'The list of chat users has been received.';
export const SUCCESSFULLY_LEAVE_FROM_CHAT_MESSAGE =
  'Successfully exited the chat';
export const SUCCESSFUL_GET_ALL_CHATS_FOR_ADMIN_MESSAGE =
  'Successfully retrieved a list of all chats';
export const SUCCESSFUL_GET_CHAT_INFO_FOR_ADMIN_MESSAGE =
  'Successfully retrieved chat and its users';

export const GET_ALL_USER_CHATS_EXAMPLE = [
  {
    id: 'c17a112f-6117-43a6-a0cf-d5f79ce0039f',
    lastReadAt: '2026-01-28T09:37:41.203Z',
    joinedAt: '2026-01-28T09:36:55.702Z',
    user: {
      id: 'b377805b-bfd7-4e6d-a428-abf2a827112a',
      email: 'student2@gmail.com',
      firstName: null,
      lastName: null,
    },
    chat: {
      id: '1d3c11dd-01b5-4aae-b58d-954f5b1e9642',
      createdAt: '2026-01-26T11:15:39.339Z',
      academicGroup: {
        id: 'c6c11d19-270d-4ef5-a3c9-c55f38fd9473',
        name: 'ео-23',
        slug: 'eo-23',
        updatedAt: '2026-01-26T11:15:39.337Z',
        createdAt: '2026-01-26T11:15:39.337Z',
      },
    },
  },
];

export const GET_TOKEN_TO_CONNECT_WEBSOCKET_EXAMPLE = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI7IkpXVCJ9.eyJpZCI6ImIzNzc4MDViLWJmZDctNGU2ZC1hNDI4LWFiZjJhODI3MTEyYSIsInJvbGVzIjpbeyJpZCI6IjBiNWUyOTFiLTg4YTEtNDU0Zi1iYWRjLTZjZDdmNmRhODZjOCIsIm5hbWUiOiLRgdGC0YPQtNC10L3RgiIsInNsdWciOiJzdHVkZW20IiwidXBkYXRlZEF0IjoiMjAyNi0wMS0yNlQxMToxMzoyMS41MjZaIiwiY3JlYXRlZEF0IjoiMjAyNi0wMS0yNlQxMToxXzoyMS41MjZaIn1dLCJpYXQiOjE3Njk3NjAxMGAsImV4cCI6MTc2OTc2MTAxMH0.06yFRrgA0ZDX4JxfN1AJ7xti4JIfoZkljwbrQQmhrQA',
};

export const GET_MESSAGES_LIST_EXAMPLE = {
  messages: [
    {
      id: 'fd2c480d-e205-44be-a29c-e2051e8207c0',
      encryptedText: 'FQJiOgvKpCTbtETJm44ghJUEqyOaw18fvQmdUQ==',
      iv: 'RatQpC6MzNsec+jU',
      encryptedKeys: {
        '34abf85a-24e8-4f7c-b3c1-3bc5041039f8':
          'JZQO6VJbp/3+ovZo15Xdu0pafSlV66AmIgWiYvIjdkN08yFogUtLYnEgHFElgqcelqD6RP5bYvEL8doeD8CYxl433d5aR5OCgr703ufmehaaMfMnDJc/padI/mGAAUO0HdRk4vjUcb0N5MhE52zjfiB2c7+DGoXz2wrZgvMS/JAxzSnyoxSBbldCAkfpzyE2FlHJF2URre9CTQo6DoKEkoglcYo3FRdbo/WIP5FajarnCWjeLpHv+ftUQMrl/g17XFmaUhxBltW9PVXDrIanlDmQqm8lJTduOZ9JBvW377KjpsjQMmqEcXqV03tSFYzUIeAmtGkVZT6LhjR04nVGNQ==',
        '7e28a00f-2596-4d63-a01e-8ccf7fc6a322':
          'ZKU/Is5H5iO1dS4f7Ur9zeigTRQzkLw0K4P4Zb6Md32+2G+NvqH2mEG9VgyfuhVAhauzRay4mcuZiBzx7uX7RzqRZXjR7Pvg266Roua0D1JvFbxoAV6AN8nun4qufVEpYChtlWOIeeN4nfx24+UB00qsa4BOFchj3tri2a7aB5cMtX46Jo7KrMjwt9yvLl124BvFZo1/8bfY7Mlgy7wxydJ17jwhYgDE84d0SlWTP2cnIZJkrcHlnZhcDPpbBlemam92jV69uLUag1sYzHDx07dc/789K6ErPIQ/HkKcU+vy7aAw5AmJ6HHnKCX0lLVBevziBztLGPIaztUHPaZEYA==',
      },
      createdAt: '2026-01-28T09:37:23.310Z',
      sender: {
        id: '34abf85a-24e8-4f7c-b3c1-3bc5041039f8',
        email: 'student@gmail.com',
        firstName: null,
        lastName: null,
      },
    },
    {
      id: '83a018a1-d97a-4a79-bfd6-53fd284b0676',
      encryptedText: 'GldDHtA5r6x8CoHQTKKc7dbbT9X2YCG1Dk7/RTXdFlLJJ6tdauc=',
      iv: 'PTPfB5BaoJ6YbyRH',
      encryptedKeys: {
        '34abf85a-24e8-4f7c-b3c1-3bc5041039f8':
          'AchNmQhj2Rtgj9cAs8/Ncl9Xz41yJ5l6wkhAW9qNDaM4v6wxd2NYSmlDSWwzpOHa9WS8fpWSRrBHw5B86t92KSRJt/NpGrKB6zQ+9ZaSQy0JstmRiCRu3G852TqCWdc4avusSIJcdzu/7j2iuIUWjjA9vDeAgpfz7IBDO3CyLtMXnbqwTabBhPehJQujWSqmpwCjLwFhV5GFflPcZIA5Ng4bkevVearTuFmb3JyxpVlEwtjoUfam2wM7VZs/oKMQU0m6MXQKTa5n88Lmgz3ZFvOgNFxwb20kD0QuOBbSzUPntVRjCnA3+cHCeqRMG2x/wuRxVJw8wdPZQNupnnSqbA==',
        '7e28a00f-2596-4d63-a01e-8ccf7fc6a322':
          'DN1uWCCcJRxhGt7xvSPrbGUWjoW9CRLSz4iBGA638sZVNdYT2rhanlrRB3tJ8QEOBYs8A5vOAjD0vsY9eAm9Yhn1lWTdJM/odVm62kzj1AgfZS5YdfydmsDkj3C7zxmjE7Z7MLxt8uOCypmXYGq+QzA9YVP3Gu3Ta/zUY+RIM9a6za9gZ1i/4pTlJjddO2bs3x9EqNP4cCeg9vdos6cPF1+jZ7+tnd/FXZL0mfOyz5CjGTtLB9CGI5j3igMrdlmccaaWqD4QHGecpKQl1+fI3I0NmGnf0ltwrYtaT14uyFfwXv7xZatP8OWuCUG/P4WKViS3LQncDc2oAfBq0pkPxA==',
        'b377805b-bfd7-4e6d-a428-abf2a827112a':
          'oZhUo5duFBkLSWbBAfPpXUnEoip5bgcbJhty+DLe9QMsAPPlMpe5kLlP3RnjnhesO1vhLOgfYHcamKmwD5y+B+x3YmC1qf6dOLFkILSckjNMmA91H2rU2EC1iV+MVanpjiC1hq5xlXAQjJGeDAyRj2rbIvQFkhvNlBB3ES2/TYHl72LS9ydz0m2GHXYemfOcr3vUnAXHEWtySP4PQgiPCEZzen/bKEzxAJooy3cdt+TggMzcWbyRe+64i6qxrUxmd3s9bDMw0lfgSl6NF5T6ipYplDk3JxR4lqSKp9mzjx9G5TL2vikxncdsSLd/AS16rNiC+rIxoATUj7q4uW6Y5g==',
      },
      createdAt: '2026-01-28T09:37:41.203Z',
      sender: {
        id: '34abf85a-24e8-4f7c-b3c1-3bc5041039f8',
        email: 'student@gmail.com',
        firstName: null,
        lastName: null,
      },
    },
  ],
  lastReadAt: '2026-01-28T09:37:41.203Z',
};

export const SUCCESSFULLY_SET_LAST_READ_MESSAGE_EXAMPLE = {
  id: 'c17a112f-6117-43a6-a0cf-d5f79ce0039f',
  lastReadAt: '2026-01-28T09:37:41.203Z',
  joinedAt: '2026-01-28T09:36:55.702Z',
  user: {
    id: 'b377805b-bfd7-4e6d-a428-abf2a827112a',
    email: 'student2@gmail.com',
    firstName: null,
    lastName: null,
  },
  chat: {
    id: '1d3c11dd-01b5-4aae-b58d-954f5b1e9642',
    createdAt: '2026-01-26T11:15:39.339Z',
    academicGroup: {
      id: 'c6c11d19-270d-4ef5-a3c9-c55f38fd9473',
      name: 'ео-23',
      slug: 'eo-23',
      updatedAt: '2026-01-26T11:15:39.337Z',
      createdAt: '2026-01-26T11:15:39.337Z',
    },
  },
};

export const LIST_CHAT_USERS_EXAMPLE = [
  {
    id: 'c17a112f-6117-43a6-a0cf-d5f79ce0039f',
    lastReadAt: '2026-01-28T09:37:41.203Z',
    joinedAt: '2026-01-28T09:36:55.702Z',
    chat: {
      id: '1d3c11dd-01b5-4aae-b58d-954f5b1e9642',
    },
    user: {
      id: 'b377805b-bfd7-4e6d-a428-abf2a827112a',
      publicKey:
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvyMQ7bywwayMphI+1FqIH06meAto94at0kheAXB5aYitylE82WlP08H0pZoYR75c46JdzM1Qtdzqv8HZDXxsbBLUWZ9fmqLieYSbZe5ae9z9MWbmnpzI3Uv9X+w00WZf2iNHmKFlr+aMH4JCF7kKkBEs82zMmipcfz8EtYqyWtZG9b4LV+HLMnZ7Keoy+jiV/MGSrV5u0xd84a7EPKm0TnbqoCRqpmL8KnhqTpJtZYNbNT1+sFTHS8GFbvnPySbRKef7OsJdu8tjGYfjlFm9waeStrRit06rsBee+AUQ4CH9Q4j/7TpFjSnDVdn9W/YQziy+6YRx/RXF4xKKxct6hQIDAQAB',
    },
  },
  {
    id: '7a1515d2-391e-416d-8c7a-febc1ee7c653',
    lastReadAt: '2026-01-28T09:37:41.203Z',
    joinedAt: '2026-01-28T09:18:35.658Z',
    chat: {
      id: '1d3c11dd-01b5-4aae-b58d-954f5b1e9642',
    },
    user: {
      id: '7e28a00f-2596-4d63-a01e-8ccf7fc6a322',
      publicKey:
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3iHvCp5xrvfyBgIa9bQE1KOwZ/JGLciJ2WkjadNgsZZcZ03gU2NwqFKwcd/r9y/jimWcmM9ljidOs39KZLXaZK5+xkbe5a5pKn8WQYY/DUi3cWL+wGJM5hDK1aihSvWfZYDCFoZObttMakRLoS8Mw/65Q1aJmTJGVvh0FWCvRfXTuZyqiBzNJ2Xb/T3TdpgN1WAFp1BO85U0LZTWnsiAlSgOxTHqy9dPLNHeEKAZSsbEzY3zC4MYHdjsHE2NlbWFaA6ffRLowaj0Q5zztPjIw9t4fnFh0SQPfGpHRioO9NdB1E01Fmw0V5I2CfE9FAAY3ws489iv3Mk/AMe9zGqquwIDAQAB',
    },
  },
  {
    id: 'a2737d0e-847a-4d11-a804-573b4fbc2754',
    lastReadAt: '2026-01-28T09:37:41.203Z',
    joinedAt: '2026-01-28T09:18:23.521Z',
    chat: {
      id: '1d3c11dd-01b5-4aae-b58d-954f5b1e9642',
    },
    user: {
      id: '34abf85a-24e8-4f7c-b3c1-3bc5041039f8',
      publicKey:
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvAXoxHz0n9GFnNhkGTSQMjPzV1gSv6nRNPPFu3FO3kwLaUrPgMU394jkuZHxWxT2EbYpR7ptD5c4TtULyFS+HnKBkvEqIbkMzRzoFIBNpYqOPOVctXxSNtQjd3KHEPA1zJakUZBzDdJkhQ+qkzmMZkyGLoHDbVCVXtOQ1apQEmZZ7ZliVpvFo0fiaQi743LynSIYUVOsy1/ZWGoQLIQzQ/XG5UaIXE2UbaDgD5Rq/L8eYW4ZhWXOxvIbTVFZzLdVi+ASC9VibFs4kgqtQcv8QZ2Qtpa9e25QYgOdvOk8SDJrGkDKc5QWzeofGm7TxucgfavyYIr6h7ejb34fIZdoBwIDAQAB',
    },
  },
];

export const GET_ALL_CHATS_FOR_ADMIN_EXAMPLE = {
  data: [
    {
      id: '710f059e-9ce4-4895-a2b6-1e5aea15e29f',
      createdAt: '2026-01-26T11:15:46.623Z',
      academicGroup: {
        id: 'ca435777-6844-44d7-a363-7daa9f5ce2f6',
        name: 'мо-23',
      },
    },
    {
      id: '1d3c11dd-01b5-4aae-b58d-954f5b1e9642',
      createdAt: '2026-01-26T11:15:39.339Z',
      academicGroup: {
        id: 'c6c11d19-270d-4ef5-a3c9-c55f38fd9473',
        name: 'ео-23',
      },
    },
    {
      id: 'a894edbe-e52b-4ad4-bc86-f39f3443e1a5',
      createdAt: '2026-01-26T11:15:34.531Z',
      academicGroup: {
        id: '3e246448-4f2e-4318-b6f2-01d3fe9c2e53',
        name: 'ем-23',
      },
    },
  ],
  total: 3,
  page: 1,
  lastPage: 1,
};

export const SUCCESSFULLY_CHAT_AND_ITS_USERS_EXAMPLE = {
  id: '1d3c11dd-01b5-4aae-b58d-954f5b1e9642',
  chatMembers: [
    {
      id: '7a1515d2-391e-416d-8c7a-febc1ee7c653',
      user: {
        id: '7e28a00f-2596-4d63-a01e-8ccf7fc6a322',
        email: 'teacher@gmail.com',
        firstName: null,
        lastName: null,
        academic_groups: [
          {
            name: 'ео-23',
          },
          {
            name: 'ем-23',
          },
        ],
      },
    },
    {
      id: 'f5dda428-5863-45d6-b520-02910d04b0bf',
      user: {
        id: 'b377805b-bfd7-4e6d-a428-abf2a827112a',
        email: 'student2@gmail.com',
        firstName: null,
        lastName: null,
        academic_groups: [
          {
            name: 'ем-23',
          },
        ],
      },
    },
  ],
  academicGroup: {
    name: 'ем-23',
  },
};

// export const CHAT_USERS_SUCCESSFULLY_UPDATED_EXAMPLE = {
//   message: 'Chat members updated successfully',
//   added: ['b377805b-bfd7-4e6d-a428-abf2a827112a'],
//   removed: ['34abf85a-24e8-4f7c-b3c1-3bc5041039f8'],
// };
// export const CHAT_USERS_SUCCESSFULLY_UPDATED_EXAMPLE = {
//   id: '1d3c11dd-01b5-4aae-b58d-954f5b1e9642',
//   chatMembers: [
//     {
//       id: '7a1515d2-391e-416d-8c7a-febc1ee7c653',
//       user: {
//         id: '7e28a00f-2596-4d63-a01e-8ccf7fc6a322',
//         email: 'teacher@gmail.com',
//         firstName: null,
//         lastName: null,
//       },
//     },
//     {
//       id: '57b171ac-e24b-4bdf-bcdf-98349d65af9b',
//       user: {
//         id: 'b377805b-bfd7-4e6d-a428-abf2a827112a',
//         email: 'student2@gmail.com',
//         firstName: null,
//         lastName: null,
//       },
//     },
//     {
//       id: 'ff8cd1dc-023d-45cb-b8f1-b4d76ac1ff39',
//       user: {
//         id: 'f283539b-5b6c-4574-aa09-e8371336f23a',
//         email: 'student3@gmail.com',
//         firstName: null,
//         lastName: null,
//       },
//     },
//   ],
//   academicGroup: {
//     name: 'ео-23',
//   },
// };

export const SUCCESSFULLY_LEAVE_FROM_CHAT_EXAMPLE = {
  success: true,
  message: 'User removed from chat',
};

export const CHATS_NOT_FOUND_EXAMPLE = {
  message: CHATS_NOT_FOUND,
  error: 'Not Found',
  statusCode: 404,
};

export const CHAT_NOT_FOUND_EXAMPLE = {
  message: CHAT_NOT_FOUND,
  error: 'Not Found',
  statusCode: 404,
};

export const VALIDATION_PIPE_PROPERTY_EXAMPLE = {
  message: [
    'property city should not exist',
    'property lastMessageId required',
  ],
  error: 'Bad Request',
  statusCode: 400,
};
