export const ROUTES = [
  {
    name: 'Сводка',
    link: '/dashboard',
    access: ['Admin', 'Reader'],
  },
  {
    name: 'Пользователи',
    link: '/users',
    access: ['Admin'],
  },
  {
    name: 'Заказы',
    link: '/orders',
    access: ['Admin', 'Reader'],
  },
  {
    name: 'Настройки',
    link: '/settings',
    access: ['Admin', 'Reader'],
  },
];
