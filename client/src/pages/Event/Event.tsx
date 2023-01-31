import { Button, Paper, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '@context';
import { UserRoles } from '@apollo-client';
import { toast } from 'react-toastify';
import { FormInput } from '@components/FormInput';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import styles from './styles.module.scss';
import { DELETE_EVENT, GET_EVENT, UPDATE_EVENT } from './constants';

type Inputs = {
  eventName: string;
  eventType: string;
  eventComment: string;
  targetDate: string;
};

export const Event = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const userRoles = useContextSelector(AppContext, (ctx) => ctx.state.userRoles);
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);
  const [editMode, setEditMode] = useState(false);

  const { data } = useQuery(GET_EVENT, {
    variables: {
      id: eventId,
    },
    skip: !eventId,
  });

  const [deleteEvent] = useMutation(DELETE_EVENT, {
    onCompleted: () => {
      toast('Событие удалено успешно', { type: 'success' });
      navigate('/events');
    },
    refetchQueries: ['getEventsByUserId'],
  });

  const handleDeleteEvent = useCallback(async () => {
    try {
      await deleteEvent({ variables: { id: eventId } });
    } catch (e) {
      // @ts-ignore
      toast(`Произошла ошибка: ${e?.message ?? ''}`, {
        type: 'error',
      });
    }
  }, [deleteEvent, eventId]);

  const toggleChangeMode = () => {
    setEditMode((prev) => !prev);
  };

  const [saveEvent] = useMutation(UPDATE_EVENT, {
    onCompleted: () => {
      toast('Событие изменено успешно', { type: 'success' });
      toggleChangeMode();
    },
    refetchQueries: ['getEventById', 'getEventsByUserId'],
  });

  const event = useMemo(
    () => ({
      id: data?.getEvent?.id,
      userId: data?.getEvent?.userId,
      eventName: data?.getEvent?.eventName,
      eventType: data?.getEvent?.eventType,
      eventComment: data?.getEvent?.eventComment,
      targetDate: dayjs(data?.getEvent?.targetDate.split?.('T')?.[0]).format('DD.MM.YYYY'),
    }),
    [data],
  );

  const form = useForm<Inputs>({
    defaultValues: event,
  });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ eventName, eventType, eventComment, targetDate }) => {
      try {
        const [d, m, y] = targetDate.split('.');
        await saveEvent({
          variables: {
            input: {
              id: event?.id,
              userId,
              eventName,
              eventType,
              eventComment,
              targetDate: dayjs(`${y}-${m}-${d}`).add(3, 'h').toISOString(),
            },
          },
        });
      } catch (e) {
        // @ts-ignore
        toast(`Произошла ошибка: ${e?.message ?? ''}`, {
          type: 'error',
        });
      }
    },
    [event, saveEvent, userId],
  );

  const handleReset = useCallback(() => {
    reset(event);
  }, [event, reset]);

  useEffect(handleReset, [handleReset]);

  return (
    <Paper elevation={2} className={styles.eventContainer}>
      {!editMode ? (
        <>
          <div className={styles.eventHeader}>
            <Typography variant="h1">{`${event?.eventName}`}</Typography>
            <Button color={event?.eventType === 'Звонок' ? 'success' : 'error'} size="small" variant="contained">
              {event?.eventType}
            </Button>
          </div>
          <Typography component="p">{`Дата: ${event?.targetDate}`}</Typography>
          <Typography component="p">{event?.eventComment}</Typography>

          <div className={styles.buttonsContainer}>
            <div>
              <Button variant="contained" onClick={toggleChangeMode}>
                Редактировать событие
              </Button>
            </div>
            {userRoles === UserRoles.Admin && (
              <div>
                <Button variant="contained" onClick={handleDeleteEvent}>
                  Удалить событие
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2} paddingBottom={2}>
                <FormInput name="eventName" label="Название события" required />
                <FormInput name="eventType" label="Тип события" required />
                <FormInput name="targetDate" label="Дата" />
                <FormInput name="eventComment" label="Комментарий" multi />
              </Stack>
              <div className={styles.bottom}>
                <Button type="submit" variant="contained">
                  Сохранить изменения
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </Paper>
  );
};
