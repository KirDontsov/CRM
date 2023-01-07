import { Box, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';

import { Curtain } from '../../components/Curtain';

import { OrdersTable } from './OrdersTable';
import { OrdersForm } from './OrdersForm';
import styles from './styles.module.scss';

export const Orders = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };
  return (
    <Box className={styles.ordersContainer}>
      <div>
        <Button type="submit" variant="contained" startIcon={<Add />} onClick={toggleDrawer}>
          Новый заказ
        </Button>
      </div>

      <Paper elevation={2} className={styles.ordersContentContainer}>
        <OrdersTable />
      </Paper>
      {open && (
        <Curtain onClose={toggleDrawer}>
          <OrdersForm onClose={toggleDrawer} />
        </Curtain>
      )}
    </Box>
  );
};
