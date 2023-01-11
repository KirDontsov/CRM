import { gql } from '@apollo/client';

import { HeadCell } from './interfaces';

export const GET_USERS = gql`
  query getUsers {
    users {
      id
      username
      email
      roles
    }
  }
`;

export const DELETE_USERS = gql`
  mutation removeUsers($ids: [String!]!) {
    removeUsers(ids: $ids) {
      id
      username
    }
  }
`;

export const HEAD_CELLS: HeadCell[] = [
  {
    id: 'username',
    numeric: false,
    disablePadding: true,
    label: 'Имя',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'roles',
    numeric: false,
    disablePadding: false,
    label: 'Роль',
  },
];
