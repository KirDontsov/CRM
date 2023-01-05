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

import { GET_USERS, HEAD_CELLS } from './constants';
import { Data } from './interfaces';

export const UsersTable = () => {
  const { data } = useQuery(GET_USERS);
  const users: Data[] = data?.users ?? [];

  const { selected, order, orderBy, isSelected, handleClick, handleSelectAllClick, handleRequestSort } =
    useTableControls<Data>(users, 'username');

  return (
    <>
      <TableToolbar numSelected={selected.length} title="Пользователи" />
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
                const isItemSelected = isSelected(row.username);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.username)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.username}
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
                    <TableCell>{row.role}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
