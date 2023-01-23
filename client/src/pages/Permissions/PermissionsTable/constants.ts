import { HeadCell } from '@src/shared/interfaces';

// TODO: поменять тип
export const HEAD_CELLS: HeadCell<any>[] = [
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
    id: 'roles',
    numeric: false,
    disablePadding: false,
    label: 'Роль',
  },
];
