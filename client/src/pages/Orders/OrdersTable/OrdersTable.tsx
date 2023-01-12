import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import { TableToolbar } from '../../../components/TableToolbar';
import { SharedTableHead } from '../../../components/SharedTableHead';
import { getComparator } from '../../../utils';
import { useTableControls } from '../../../shared';

import { DELETE_ORDERS, GET_ORDERS, HEAD_CELLS } from './constants';
import { Data } from './interfaces';
import styles from './styles.module.scss';
import { mapWorkTypes } from './utils';

export const OrdersTable = () => {
  const { data, loading } = useQuery(GET_ORDERS);
  const orders: Data[] = data?.getOrders ?? [];

  const {
    selected,
    order,
    orderBy,
    isSelected,
    handleClick,
    handleSelectAllClick,
    handleRequestSort,
    handleDeleteItems,
  } = useTableControls<Data>(orders, 'orderName', DELETE_ORDERS, 'getOrders');

  return (
    <>
      <TableToolbar numSelected={selected.length} title="Заказы" deleteItems={handleDeleteItems} />
      <TableContainer>
        {!loading && (
          <Table sx={{ minWidth: 1765 }} aria-labelledby="tableTitle" size="medium">
            <SharedTableHead<Data>
              data={HEAD_CELLS}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={orders.length}
            />
            <TableBody>
              {orders
                .slice()
                // @ts-ignore
                .sort(getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{
                        pl: { sm: 2 },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell>{dayjs(row?.createdAt).format('DD.MM.YYYY')}</TableCell>
                      <TableCell>
                        {row?.initialPhotos && (
                          <div
                            className={styles.photo}
                            style={{
                              backgroundImage: `url(https://drive.google.com/uc?id=${
                                row?.initialPhotos?.split('=')[1]
                              })`,
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{row.orderName}</TableCell>
                      <TableCell>{row.initialCost}</TableCell>
                      <TableCell>{mapWorkTypes(row.leftHeadlamp)}</TableCell>
                      <TableCell>{mapWorkTypes(row.rightHeadlamp)}</TableCell>
                      <TableCell>{row?.releaseDate ? dayjs(row?.releaseDate).format('DD.MM.YYYY') : ''}</TableCell>
                      <TableCell>{row.sparePartsCost === '0' ? '' : row.sparePartsCost}</TableCell>
                      <TableCell>{row.totalCost}</TableCell>
                      <TableCell>{row.initialComment}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
};
