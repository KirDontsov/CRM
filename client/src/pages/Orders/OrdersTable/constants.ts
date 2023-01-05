import { gql } from '@apollo/client';

import { HeadCell } from './interfaces';

export const GET_ORDERS = gql`
  query getOrders {
    orders {
      id
      releaseDate
      createdAt
      orderName
      initialComment
      spareParts
      totalCost
      initialPhotos
      initialCost
      leftHeadlamp
      rightHeadlamp
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
    id: 'initialComment',
    numeric: false,
    disablePadding: false,
    label: 'Первичный коментарий к заказу',
  },
];
