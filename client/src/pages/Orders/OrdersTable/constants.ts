import { gql } from '@apollo/client';

import { HeadCell } from './interfaces';

export const GET_ORDERS = gql`
  query getOrders {
    getOrders {
      id
      releaseDate
      createdAt
      orderName
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
    label: 'Первичные фото',
  },
  {
    id: 'orderName',
    numeric: false,
    disablePadding: true,
    label: 'Наименование заказа',
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
    label: 'Работы по левой фаре',
  },
  {
    id: 'rightHeadlamp',
    numeric: false,
    disablePadding: false,
    label: 'Работы по правой фаре',
  },
  {
    id: 'releaseDate',
    numeric: false,
    disablePadding: false,
    label: 'Дата завершения заказа',
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
    label: 'Первичный коментарий к заказу',
  },
];
