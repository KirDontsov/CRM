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

export const DELETE_EVENT = gql`
  mutation removeEvent($id: String!) {
    removeEvent(id: $id) {
      id
      eventName
    }
  }
`;
