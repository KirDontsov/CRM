import { FC, memo, useCallback, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { TableToolbar } from '@components/TableToolbar';
import { SharedTableHead } from '@components/SharedTableHead';
import { useTableControls, getComparator, PAGING } from '@shared';
import { OrdersStatuses } from '@src/apollo-client';
import produce from 'immer';
import { FetchMoreObserver } from '@components/FetchMoreObserver';
import { DeleteConfirmation } from '@components/DeleteConfirmation';
import { GET_ORDERS } from '@src/shared/constants';

import { STATUS_OPTIONS } from '../OrdersForm/constants';

import { DELETE_ORDERS, HEAD_CELLS } from './constants';
import { OrdersData } from './interfaces';
import styles from './styles.module.scss';
import { mapWorkTypes } from './utils';

export interface OrdersTableProps {
  onSelect: (id: string) => void;
}
export const OrdersTable: FC<OrdersTableProps> = memo(({ onSelect }) => {
  const { data, fetchMore, loading } = useQuery(GET_ORDERS, {
    variables: {
      limit: PAGING.limit,
      offset: PAGING.offset,
    },
  });

  const { orders, ordersCount }: { orders: OrdersData[]; ordersCount: number } = useMemo(
    () => ({ orders: data?.getOrders ?? [], ordersCount: data?.countOrders }),
    [data],
  );

  const {
    selected,
    order,
    orderBy,
    isSelected,
    isDeleteCurtainOpen,
    handleOpenDeleteCurtain,
    handleCloseDeleteCurtain,
    handleClick,
    handleSelectAllClick,
    handleRequestSort,
    handleDeleteItems,
  } = useTableControls<OrdersData>(orders, 'orderName', DELETE_ORDERS, 'getOrders');

  const handleFetchMore = useCallback(async () => {
    if (loading) return false;
    await fetchMore({
      variables: { limit: PAGING.limit, offset: orders.length || PAGING.offset },
      updateQuery: (prev, { fetchMoreResult }) =>
        produce(prev, (result: { getOrders: OrdersData[] }) => {
          result?.getOrders?.push(...(fetchMoreResult?.getOrders || []));
        }),
    });
    return orders.length >= ordersCount;
  }, [loading, fetchMore, orders, ordersCount]);

  return (
    <>
      <TableToolbar numSelected={selected.length} title="Заказы" deleteItems={handleOpenDeleteCurtain} />
      <TableContainer
        id="container"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <div style={{ minWidth: 1765 }} id="table">
          <Table aria-labelledby="tableTitle" size="medium">
            <SharedTableHead<OrdersData>
              data={HEAD_CELLS}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={orders.length}
            />
            <TableBody>
              {Boolean(orders.length) &&
                orders
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
                        <TableCell
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(row.id);
                          }}
                          sx={{
                            color: (theme) => theme.palette.secondary.main,
                          }}
                          className={styles.nameLink}
                        >
                          {row.orderName}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...(row.status === OrdersStatuses.Done && {
                              color: (theme) => theme.palette.success.main,
                            }),
                            ...(row.status === OrdersStatuses.InProgress && {
                              color: (theme) => theme.palette.primary.main,
                            }),
                            ...(row.status === OrdersStatuses.Cancelled && {
                              color: (theme) => theme.palette.error.main,
                            }),
                          }}
                        >
                          {STATUS_OPTIONS.find(({ id }) => row?.status === id)?.label}
                        </TableCell>
                        <TableCell>{row?.initialCost}</TableCell>
                        <TableCell>{mapWorkTypes(row?.leftHeadlamp)}</TableCell>
                        <TableCell>{mapWorkTypes(row?.rightHeadlamp)}</TableCell>
                        <TableCell>{row?.releaseDate ? dayjs(row?.releaseDate).format('DD.MM.YYYY') : ''}</TableCell>
                        <TableCell>{row?.sparePartsCost === '0' ? '' : row?.sparePartsCost}</TableCell>
                        <TableCell>{row?.totalCost}</TableCell>
                        <TableCell>{row?.initialComment}</TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
      <FetchMoreObserver
        fetchMore={handleFetchMore}
        fetchMoreLoading={loading}
        itemsLength={orders.length}
        totalCount={ordersCount}
      />
      {isDeleteCurtainOpen && <DeleteConfirmation onClose={handleCloseDeleteCurtain} onSubmit={handleDeleteItems} />}
    </>
  );
});
