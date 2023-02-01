import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query getEventsByUserId($limit: Int!, $offset: Int!) {
    countEvents
    getEventsByUserId(limit: $limit, offset: $offset) {
      id
      eventName
      eventType
      eventComment
      targetDate
    }
  }
`;
