import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($input: LoginUserInput!) {
    login(loginUserInput: $input) {
      user {
        id
        roles
      }
      access_token
    }
  }
`;
