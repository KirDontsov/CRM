import { gql } from '@apollo/client';

export const CREATE_EVENT = gql`
  mutation createEvent($input: CreateEventInput!) {
    createEvent(createEventInput: $input) {
      userId
      eventName
      eventType
      eventComment
      targetDate
    }
  }
`;
