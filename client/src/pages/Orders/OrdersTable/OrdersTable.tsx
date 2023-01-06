import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { useQuery } from '@apollo/client';

import { TableToolbar } from '../../../components/TableToolbar';
import { SharedTableHead } from '../../../components/SharedTableHead';
import { getComparator } from '../../../utils';
import { useTableControls } from '../../../shared';

import { GET_ORDERS, HEAD_CELLS } from './constants';
import { Data } from './interfaces';
import styles from './styles.module.scss';

export const OrdersTable = () => {
  const { data, loading } = useQuery(GET_ORDERS);
  const orders: Data[] = data?.orders ?? [];

  const { selected, order, orderBy, isSelected, handleClick, handleSelectAllClick, handleRequestSort } =
    useTableControls<Data>(orders, 'orderName');

  return (
    <>
      <TableToolbar numSelected={selected.length} title="Заказы" />
      <TableContainer>
        {!loading && (
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
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
                      <TableCell>{row?.createdAt?.split('T')[0]}</TableCell>
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
                      <TableCell>{row.leftHeadlamp ? 'Да' : ''}</TableCell>
                      <TableCell>{row.rightHeadlamp ? 'Да' : ''}</TableCell>
                      <TableCell>{row.releaseDate?.split('T')[0]}</TableCell>
                      <TableCell>{row.sparePartsCost}</TableCell>
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
