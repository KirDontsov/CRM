import { Paper, Typography } from '@mui/material';

import styles from './styles.module.scss';

export const Dashboard = () => {
  return (
    <Paper elevation={2} className={styles.dashboardContainer}>
      <Typography variant="h1">Сводка</Typography>
    </Paper>
  );
};
