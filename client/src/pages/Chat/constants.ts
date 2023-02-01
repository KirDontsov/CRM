import { gql } from '@apollo/client';

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
