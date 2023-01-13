import { Box, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';

import { Curtain } from '../../components/Curtain';

import { OrdersTable } from './OrdersTable';
import { OrdersForm } from './OrdersForm';
import styles from './styles.module.scss';

export const Orders = () => {
  const [selected, setSelected] = useState('');

  const handleOpen = () => {
    setSelected('new');
  };

  const handleClose = () => {
    setSelected('');
  };

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  return (
    <Box className={styles.ordersContainer}>
      <div>
        <Button type="submit" variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Новый заказ
        </Button>
      </div>

      <Paper elevation={2} className={styles.ordersContentContainer}>
        <OrdersTable onSelect={handleSelect} />
      </Paper>
      {selected && (
        <Curtain onClose={handleClose}>
          <OrdersForm selected={selected} onClose={handleClose} />
        </Curtain>
      )}
    </Box>
  );
};
