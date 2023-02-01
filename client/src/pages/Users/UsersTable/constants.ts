import { gql } from '@apollo/client';
import { HeadCell } from '@src/shared/interfaces';

import { Data } from './interfaces';

export const GET_USERS = gql`
  query getUsers($limit: Int!, $offset: Int!) {
    countUsers
    getUsers(limit: $limit, offset: $offset) {
      id
      username
      email
      roles
      filials {
        name
      }
    }
  }
`;

export const DELETE_USERS = gql`
  mutation deleteUsers($ids: [String!]!) {
    deleteUsers(ids: $ids) {
      id
      username
    }
  }
`;

export const HEAD_CELLS: HeadCell<Data>[] = [
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
  {
    id: 'filials',
    numeric: false,
    disablePadding: false,
    label: 'Филиал',
  },
  {
    id: 'chat',
    numeric: false,
    disablePadding: false,
    label: 'Написать',
  },
];
