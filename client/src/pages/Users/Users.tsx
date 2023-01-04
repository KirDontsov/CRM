import { UsersTable } from './UsersTable';
import styles from './styles.module.scss';

export const Users = () => {
  return (
    <div className={styles.usersContainer}>
      <UsersTable />
    </div>
  );
};
