import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query getEventsByUserId($userId: String!, $limit: Int!, $offset: Int!) {
    countEvents(userId: $userId)
    getEventsByUserId(userId: $userId, limit: $limit, offset: $offset) {
      id
      eventName
      eventType
      eventComment
      targetDate
    }
  }
`;
