import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import dayjs from 'dayjs';

import { FormInput } from '../../../components/FormInput';
import { EventsData } from '../interfaces';

import { CREATE_EVENT } from './constants';
import styles from './styles.module.scss';

type Inputs = {
  eventName: string;
  // TODO: привести к enum
  eventType: string;
  eventComment: string;
};

export interface EventFormProps {
  events: EventsData[];
  date: Date | null;
  onClose: () => void;
}

export const EventForm: FC<EventFormProps> = ({ date, events, onClose }) => {
  const navigate = useNavigate();
  const [createEvent] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      // TODO: показать тост успех
      onClose();
    },
    refetchQueries: ['getEvents'],
  });

  const form = useForm<Inputs>();

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ eventName, eventType, eventComment }) => {
      await createEvent({
        variables: {
          input: { eventName, eventType, eventComment, targetDate: date ? dayjs(date).add(3, 'h').toISOString() : '' },
        },
      });
    },
    [createEvent, date],
  );

  const eventsThatDay = events.filter((event) => dayjs(event.targetDate.split('T')[0]).isSame(date), 'd');

  const handleEventClick = useCallback(
    (eventId: string) => {
      navigate(`/events/${eventId}`);
    },
    [navigate],
  );

  return (
    <div className={styles.eventFormContent}>
      {Boolean(eventsThatDay?.length) && (
        <div className={styles.events}>
          <Typography variant="h1" className={styles.heading}>
            Уже есть созданные события на&nbsp;
            <Typography component="span" variant="h1" color="primary">
              {`${date ? dayjs(date).format('DD.MM.YYYY') : ''}:`}
            </Typography>
          </Typography>
          <div className={styles.eventsList}>
            {eventsThatDay.map((ev) => (
              <div key={ev.id} className={styles.eventCard}>
                <CardActionArea onClick={() => handleEventClick(ev.id)}>
                  <Card elevation={24}>
                    <CardContent>
                      <div className={styles.eventCardContent}>
                        <Typography component="h3" variant="h6">
                          {ev.eventName}
                        </Typography>
                        <Typography component="p">{ev.eventType}</Typography>
                        <Typography component="p">{ev.eventComment}</Typography>
                      </div>
                    </CardContent>
                  </Card>
                </CardActionArea>
              </div>
            ))}
          </div>
        </div>
      )}
      <Typography variant="h1" className={styles.heading}>
        {!eventsThatDay?.length ? (
          <>
            Создание нового события на&nbsp;
            <Typography component="span" variant="h1" color="primary">
              {date ? dayjs(date).format('DD.MM.YYYY') : ''}
            </Typography>
          </>
        ) : (
          `Хотите создать еще одно событие?`
        )}
      </Typography>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} paddingBottom={2}>
            <FormInput name="eventName" label="Название события" required />
            <FormInput name="eventType" label="Тип события" required />
            <FormInput name="eventComment" label="Комментарий" multi />
          </Stack>
          <div className={styles.bottom}>
            <Button type="submit" variant="contained">
              Создать событие
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
