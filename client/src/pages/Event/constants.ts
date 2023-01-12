import { gql } from '@apollo/client';

export const GET_EVENT = gql`
  query getEventById($id: String!) {
    getEvent(id: $id) {
      id
      eventName
      eventType
      eventComment
      targetDate
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation deleteEvent($id: String!) {
    deleteEvent(id: $id) {
      id
      eventName
    }
  }
`;
