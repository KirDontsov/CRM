import { gql } from '@apollo/client';

import { HeadCell } from './interfaces';

export const GET_ORDERS = gql`
  query getOrders($limit: Int!, $offset: Int!) {
    countOrders
    getOrders(limit: $limit, offset: $offset) {
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

export const DELETE_ORDERS = gql`
  mutation deleteOrders($ids: [String!]!) {
    deleteOrders(ids: $ids) {
      id
      orderName
    }
  }
`;

export const HEAD_CELLS: HeadCell[] = [
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: true,
    label: 'Дата поступления',
  },
  {
    id: 'initialPhotos',
    numeric: false,
    disablePadding: true,
    label: 'Фото',
  },
  {
    id: 'orderName',
    numeric: false,
    disablePadding: true,
    label: 'Название заказа',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Статус',
  },
  {
    id: 'initialCost',
    numeric: false,
    disablePadding: false,
    label: 'Начальная стоимость',
  },
  {
    id: 'leftHeadlamp',
    numeric: false,
    disablePadding: false,
    label: 'Работы левая фара',
  },
  {
    id: 'rightHeadlamp',
    numeric: false,
    disablePadding: false,
    label: 'Работы правая фара',
  },
  {
    id: 'releaseDate',
    numeric: false,
    disablePadding: false,
    label: 'Дата закрытия',
  },
  {
    id: 'sparePartsCost',
    numeric: false,
    disablePadding: false,
    label: 'Стоимость запчастей',
  },
  {
    id: 'totalCost',
    numeric: false,
    disablePadding: false,
    label: 'Итоговая сумма',
  },
  {
    id: 'initialComment',
    numeric: false,
    disablePadding: false,
    label: 'Коментарий',
  },
];
