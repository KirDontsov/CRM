import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query getEventsByUserId($userId: String!) {
    getEventsByUserId(userId: $userId) {
      id
      eventName
      eventType
      eventComment
      targetDate
    }
  }
`;
