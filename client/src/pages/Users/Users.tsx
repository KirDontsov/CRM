import { Box, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';

import { Curtain } from '../../components/Curtain';

import { UsersTable } from './UsersTable';
import { UsersForm } from './UsersForm';
import styles from './styles.module.scss';

export const Users = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box className={styles.usersContainer}>
      <div>
        <Button type="submit" variant="contained" startIcon={<Add />} onClick={toggleDrawer}>
          Новый пользователь
        </Button>
      </div>

      <Paper elevation={2} className={styles.usersContentContainer}>
        <UsersTable />
      </Paper>
      {open && (
        <Curtain onClose={toggleDrawer}>
          <UsersForm onClose={toggleDrawer} />
        </Curtain>
      )}
    </Box>
  );
};
