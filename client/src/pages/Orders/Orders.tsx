import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

import styles from './styles.module.scss';
import { OrdersTable } from './OrdersTable';

export const Orders = () => {
  return (
    <div className={styles.ordersContainer}>
      <div>
        <Button type="submit" variant="contained" startIcon={<Add />}>
          Новый заказ
        </Button>
      </div>

      <div className={styles.ordersContentContainer}>
        <OrdersTable />
      </div>
    </div>
  );
};
