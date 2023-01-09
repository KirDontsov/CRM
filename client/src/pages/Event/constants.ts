import { gql } from '@apollo/client';

export const GET_EVENT = gql`
  query getEventById($id: String!) {
    event(id: $id) {
      id
      eventName
      eventType
      eventComment
      targetDate
    }
  }
`;
