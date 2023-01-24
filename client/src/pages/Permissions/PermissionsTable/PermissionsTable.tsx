import { useMemo } from 'react';
import { useContextSelector } from 'use-context-selector';
import { TableToolbar } from '@components/TableToolbar';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import { SharedTableHead } from '@components/SharedTableHead';
import TableBody from '@mui/material/TableBody';
import { getComparator, useTableControls } from '@shared';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import { useQuery } from '@apollo/client';
import { AppContext } from '@context';
import { DELETE_USERS } from '@pages/Users/UsersTable/constants';

import { GET_PERMISSIONS, HEAD_CELLS } from './constants';
import { PermissionData } from './interfaces';

export const PermissionsTable = () => {
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);
  // TODO: заменить на разрешения
  const { data } = useQuery(GET_PERMISSIONS, {
    variables: {
      id: userId,
    },
    skip: !userId,
  });

  const permissions: PermissionData[] = useMemo(() => data?.getPermissions ?? [], [data]);

  const {
    selected,
    order,
    orderBy,
    isSelected,
    handleClick,
    handleSelectAllClick,
    handleRequestSort,
    handleDeleteItems,
  } = useTableControls<PermissionData>(permissions, 'value', DELETE_USERS, 'getUsers');

  return (
    <>
      <TableToolbar numSelected={selected.length} title="Разрешения" deleteItems={handleDeleteItems} />
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <SharedTableHead<PermissionData>
            data={HEAD_CELLS}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={permissions.length}
          />
          <TableBody>
            {Boolean(permissions.length) &&
              permissions
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
                      <TableCell>{row.value}</TableCell>
                      <TableCell>{row.id}</TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
