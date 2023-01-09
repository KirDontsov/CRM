import { Button, Paper, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { GET_EVENT } from './constants';
import styles from './styles.module.scss';

export const Event = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const { data } = useQuery(GET_EVENT, {
    variables: {
      id: eventId,
    },
    skip: !eventId,
  });
  const event = data?.event ?? {};

  return (
    <Paper elevation={2} className={styles.eventContainer}>
      <div className={styles.eventHeader}>
        <Typography variant="h1">{`${event.eventName}`}</Typography>
        <Button color={event.eventType === 'Звонок' ? 'success' : 'error'} size="small" variant="contained">
          {event.eventType}
        </Button>
      </div>
      <Typography component="p">{event.eventComment}</Typography>
    </Paper>
  );
};
