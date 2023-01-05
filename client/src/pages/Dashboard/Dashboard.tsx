import { Typography } from '@mui/material';

import styles from './styles.module.scss';

export const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Typography variant="h1">Сводка</Typography>
    </div>
  );
};
