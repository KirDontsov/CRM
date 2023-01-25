import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { useQuery } from '@apollo/client';
import { TableToolbar } from '@components/TableToolbar';
import { SharedTableHead } from '@components/SharedTableHead';
import { getComparator, PAGING, useTableControls } from '@shared';
import { UserRoles } from '@src/apollo-client';
import { FetchMoreObserver } from '@components/FetchMoreObserver/FetchMoreObserver';
import { useCallback, useMemo } from 'react';
import produce from 'immer';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '@context';

import { DELETE_USERS, GET_USERS, HEAD_CELLS } from './constants';
import { Data } from './interfaces';

export const UsersTable = () => {
  const filialIds = useContextSelector(AppContext, (ctx) => ctx.state.filialIds);
  const { data, fetchMore, loading } = useQuery(GET_USERS, {
    variables: {
      filialIds,
      limit: PAGING.limit,
      offset: PAGING.offset,
    },
    skip: !filialIds?.length,
  });
  const { users, usersCount }: { users: Data[]; usersCount: number } = useMemo(
    () => ({
      users: (data?.getUsers ?? []).map((user: Omit<Data, 'filials'> & { filials: [{ name: string }] }) => ({
        ...user,
        filials: user.filials.map(({ name }) => name).join(', '),
      })),
      usersCount: data?.countUsers ?? 0,
    }),
    [data],
  );

  const {
    selected,
    order,
    orderBy,
    isSelected,
    handleClick,
    handleSelectAllClick,
    handleRequestSort,
    handleDeleteItems,
  } = useTableControls<Data>(users, 'username', DELETE_USERS, 'getUsers');

  const handleFetchMore = useCallback(async () => {
    if (loading) return false;
    await fetchMore({
      variables: { limit: PAGING.limit, offset: users.length || PAGING.offset },
      updateQuery: (prev, { fetchMoreResult }) =>
        produce(prev, (result: { getUsers: Data[] }) => {
          result?.getUsers?.push(...(fetchMoreResult?.getUsers || []));
        }),
    });
    return users.length >= usersCount;
  }, [loading, fetchMore, users, usersCount]);

  return (
    <>
      <TableToolbar numSelected={selected.length} title="Пользователи" deleteItems={handleDeleteItems} />
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <SharedTableHead<Data>
            data={HEAD_CELLS}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={users.length}
          />
          <TableBody>
            {Boolean(users.length) &&
              users
                .slice()
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
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.username}
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.roles === UserRoles.Admin ? 'Админ' : 'Менеджер'}</TableCell>
                      <TableCell>{row.filials}</TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      {users.length > 19 && (
        <FetchMoreObserver
          fetchMore={handleFetchMore}
          fetchMoreLoading={loading}
          itemsLength={users.length}
          totalCount={usersCount}
        />
      )}
    </>
  );
};
