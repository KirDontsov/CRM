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
import { UserRoles } from '../../../apollo-client';

import { DELETE_USERS, GET_USERS, HEAD_CELLS } from './constants';
import { Data } from './interfaces';

export const UsersTable = () => {
  const { data } = useQuery(GET_USERS);
  const users: Data[] = data?.users ?? [];

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
            {users
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
