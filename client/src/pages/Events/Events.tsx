import { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useContextSelector } from 'use-context-selector';

import { Calendar } from '../../components/Calendar';
import { Curtain } from '../../components/Curtain';
import { AppContext } from '../../context';

import styles from './styles.module.scss';
import { EventForm } from './EventForm';
import { EventsData } from './interfaces';
import { GET_EVENTS } from './constants';

export function isEvent(date: Date): date is Date {
  return !Object.prototype.hasOwnProperty.call(date, 'type');
}

export const Events = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);

  const { data, loading } = useQuery(GET_EVENTS, {
    variables: {
      userId,
    },
  });
  const events: EventsData[] = data?.getEventsByUserId ?? [];

  const toggleDrawer = (newDate?: Date) => {
    if (newDate && isEvent(newDate)) {
      setDate(newDate);
    }
    setOpen((prev) => !prev);
  };

  return (
    <Paper elevation={2} className={styles.eventsContainer}>
      <Typography variant="h1">События</Typography>
      <Calendar onDateSelect={toggleDrawer} events={events} loading={loading} />
      {open && (
        <Curtain onClose={toggleDrawer}>
          <EventForm onClose={toggleDrawer} date={date} events={events} />
        </Curtain>
      )}
    </Paper>
  );
};
