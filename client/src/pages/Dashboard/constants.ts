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

export const CHART_DATA = [
  {
    name: 'Янв.',
    uv: 4000,
    pv: 2400,
  },
  {
    name: 'Фев.',
    uv: 3000,
    pv: 1398,
  },
  {
    name: 'Мар.',
    uv: 2000,
    pv: 1000,
  },
  {
    name: 'Апр.',
    uv: 2780,
    pv: 3908,
  },
  {
    name: 'Май',
    uv: 1890,
    pv: 4800,
  },
  {
    name: 'Июн.',
    uv: 2390,
    pv: 3800,
  },
  {
    name: 'Июл.',
    uv: 3490,
    pv: 4300,
  },
  {
    name: 'Авг.',
    uv: 1890,
    pv: 4800,
  },
  {
    name: 'Сен.',
    uv: 3490,
    pv: 4300,
  },
  {
    name: 'Окт.',
    uv: 3490,
    pv: 4300,
  },
  {
    name: 'Дек.',
    uv: 2000,
    pv: 9800,
  },
];
