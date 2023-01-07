import { useState } from 'react';
import { Paper, Typography } from '@mui/material';

import { Calendar } from '../../components/Calendar';
import { Curtain } from '../../components/Curtain';

import styles from './styles.module.scss';
import { EventForm } from './EventForm';

export function isEvent(date: Date): date is Date {
  return !Object.prototype.hasOwnProperty.call(date, 'type');
}

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const toggleDrawer = (newDate?: Date) => {
    if (newDate && isEvent(newDate)) {
      setDate(newDate);
    }
    setOpen((prev) => !prev);
  };

  return (
    <Paper elevation={2} className={styles.dashboardContainer}>
      <Typography variant="h1">Сводка</Typography>
      <Calendar onDateSelect={toggleDrawer} />
      {open && (
        <Curtain onClose={toggleDrawer}>
          <EventForm onClose={toggleDrawer} date={date} />
        </Curtain>
      )}
    </Paper>
  );
};
