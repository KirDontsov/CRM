import { gql } from '@apollo/client';

export const COUNT_ORDERS_BY_MASTER = gql`
  query countOrdersByMasterId($masterIds: [String!]!) {
    countOrdersByMasterId(masterIds: $masterIds)
  }
`;

export const GET_ORDERS_BY_MASTER = gql`
  query getOrdersByMasterId($limit: Int!, $offset: Int!, $masterIds: [String!]!) {
    countOrdersByMasterId(masterIds: $masterIds)
    getOrdersByMasterId(limit: $limit, offset: $offset, masterIds: $masterIds) {
      id
      releaseDate
      createdAt
      orderName
      status
      initialComment
      sparePartsCost
      totalCost
      initialPhotos
      initialCost
      leftHeadlamp
      rightHeadlamp
    }
  }
`;
