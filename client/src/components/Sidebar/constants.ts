import { UserRoles } from '../../apollo-client';

export const ROUTES = [
  {
    name: 'Сводка',
    link: '/dashboard',
    access: [UserRoles.Admin, UserRoles.Reader],
  },
  {
    name: 'Пользователи',
    link: '/users',
    access: [UserRoles.Admin],
  },
  {
    name: 'Заказы',
    link: '/orders',
    access: [UserRoles.Admin, UserRoles.Reader],
  },
  {
    name: 'Настройки',
    link: '/settings',
    access: [UserRoles.Admin, UserRoles.Reader],
  },
];