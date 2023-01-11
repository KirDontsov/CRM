import { memo } from 'react';
import Toolbar from '@mui/material/Toolbar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useContextSelector } from 'use-context-selector';

import { AppContext } from '../../context';
import { UserRoles } from '../../apollo-client';

export interface EnhancedTableToolbarProps {
  title: string;
  numSelected: number;
  deleteItems: () => void;
}

export const TableToolbar = memo(({ numSelected, title, deleteItems }: EnhancedTableToolbarProps) => {
  const userRoles = useContextSelector(AppContext, (ctx) => ctx.state.userRoles);
  return (
    <Toolbar
      sx={{
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="span">
          {`Выбрано: ${numSelected}`}
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h1" id="tableTitle" component="h1">
          {title}
        </Typography>
      )}
      {numSelected > 0 && userRoles === UserRoles.Admin ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon onClick={deleteItems} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
});
