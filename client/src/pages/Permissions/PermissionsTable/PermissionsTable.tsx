import { TableToolbar } from '@components/TableToolbar';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import { SharedTableHead } from '@components/SharedTableHead';
import { Data } from '@pages/Users/UsersTable/interfaces';
import { DELETE_USERS, GET_USERS, HEAD_CELLS } from '@pages/Users/UsersTable/constants';
import TableBody from '@mui/material/TableBody';
import { getComparator, PAGING, useTableControls } from '@shared';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import { UserRoles } from '@apollo-client';
import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import produce from 'immer';

export const PermissionsTable = () => {
  // TODO: заменить на разрешения
  const { data, fetchMore, loading } = useQuery(GET_USERS, {
    variables: {
      limit: PAGING.limit,
      offset: PAGING.offset,
    },
  });
  const { users, usersCount }: { users: Data[]; usersCount: number } = useMemo(
    () => ({ users: data?.getUsers ?? [], usersCount: data?.countUsers ?? 0 }),
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
      <TableToolbar numSelected={selected.length} title="Разрешения" deleteItems={handleDeleteItems} />
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
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
