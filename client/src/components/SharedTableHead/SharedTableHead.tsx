import { ChangeEvent, ComponentProps, ComponentType, memo, MouseEvent } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import { HeadCell } from '@src/shared/interfaces';
import CreateIcon from '@mui/icons-material/Create';

export type Order = 'asc' | 'desc';

export interface SharedTableHeadProps<V> {
  data: HeadCell<V>[];
  numSelected: number;
  onRequestSort: (event: MouseEvent<unknown>, property: keyof V) => void;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

type PropsComparator<V extends ComponentType> = (
  prevProps: Readonly<ComponentProps<V>>,
  nextProps: Readonly<ComponentProps<V>>,
) => boolean;

// кастомная обертка над React.memo чтобы можно было пробросить дженерик
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function typedMemo<V extends ComponentType<any>>(Component: V, propsComparator?: PropsComparator<V>) {
  return memo(Component, propsComparator) as unknown as V;
}

export function TableHeadComponent<T>({
  data,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}: SharedTableHeadProps<T>) {
  const createSortHandler = (property: keyof T) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {data.map((headCell) => (
          <TableCell
            key={String(headCell.id ?? '')}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell?.icon ? (
              <CreateIcon />
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export const SharedTableHead = typedMemo(TableHeadComponent);
