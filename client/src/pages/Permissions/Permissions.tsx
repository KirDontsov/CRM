import { Box, Paper } from '@mui/material';
import { PermissionsTable } from '@pages/Permissions/PermissionsTable';

import styles from './permissions.module.scss';

export const Permissions = () => {
  return (
    <Box className={styles.permissionsContainer}>
      <Paper elevation={2} className={styles.permissionsContentContainer}>
        <PermissionsTable />
      </Paper>
    </Box>
  );
};
