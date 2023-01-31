import { gql } from '@apollo/client';

export const PAGING = {
  limit: 20,
  offset: 0,
};

export const GET_FILIALS = gql`
  query getFilials {
    getFilials {
      id
      name
    }
  }
`;
