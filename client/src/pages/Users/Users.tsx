import { Button } from '@mui/material';
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
    <div className={styles.usersContainer}>
      <div>
        <Button type="submit" variant="contained" startIcon={<Add />} onClick={toggleDrawer}>
          Новый пользователь
        </Button>
      </div>

      <div className={styles.usersContentContainer}>
        <UsersTable />
      </div>
      {open && (
        <Curtain onClose={toggleDrawer}>
          <UsersForm onClose={toggleDrawer} />
        </Curtain>
      )}
    </div>
  );
};
