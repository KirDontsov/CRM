import { Button, Paper, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';

import { AppContext } from '../../context';
import { UserRoles } from '../../apollo-client';

import styles from './styles.module.scss';
import { DELETE_EVENT, GET_EVENT } from './constants';

export const Event = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const userRoles = useContextSelector(AppContext, (ctx) => ctx.state.userRoles);

  const { data } = useQuery(GET_EVENT, {
    variables: {
      id: eventId,
    },
    skip: !eventId,
  });
  const event = data?.event ?? {};

  const [deleteEvent] = useMutation(DELETE_EVENT, {
    onCompleted: () => {
      // TODO: показать тост успех
      navigate('/events');
    },
    onError: () => {
      // TODO: показать тост error
    },
    refetchQueries: ['getEvents', 'getEventById'],
  });

  const handleDeleteEvent = useCallback(async () => {
    await deleteEvent({ variables: { id: eventId } });
  }, [deleteEvent, eventId]);

  return (
    <Paper elevation={2} className={styles.eventContainer}>
      <div className={styles.eventHeader}>
        <Typography variant="h1">{`${event?.eventName}`}</Typography>
        <Button color={event?.eventType === 'Звонок' ? 'success' : 'error'} size="small" variant="contained">
          {event?.eventType}
        </Button>
      </div>
      <Typography component="p">{event?.eventComment}</Typography>
      {userRoles === UserRoles.Admin && (
        <div>
          <Button variant="contained" onClick={handleDeleteEvent}>
            Удалить событие
          </Button>
        </div>
      )}
    </Paper>
  );
};
