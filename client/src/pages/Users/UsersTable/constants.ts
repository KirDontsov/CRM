import { HeadCell } from './interfaces';

export const HEAD_CELLS: readonly HeadCell[] = [
  {
    id: 'username',
    numeric: false,
    disablePadding: true,
    label: 'Имя',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Роль',
  },
];
