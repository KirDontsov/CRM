import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

import { UsersTable } from './UsersTable';
import styles from './styles.module.scss';

export const Users = () => {
  return (
    <div className={styles.usersContainer}>
      <div>
        <Button type="submit" variant="contained" startIcon={<Add />}>
          Новый пользователь
        </Button>
      </div>

      <div className={styles.usersContentContainer}>
        <UsersTable />
      </div>
    </div>
  );
};
