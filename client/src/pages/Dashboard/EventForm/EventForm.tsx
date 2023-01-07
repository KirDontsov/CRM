import { FC, useCallback } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import dayjs from 'dayjs';

import { FormInput } from '../../../components/FormInput';

import { CREATE_EVENT } from './constants';
import styles from './styles.module.scss';

type Inputs = {
  eventName: string;
  // TODO: привести к enum
  eventType: string;
  eventComment: string;
};

export interface EventFormProps {
  date: Date | null;
  onClose: () => void;
}

export const EventForm: FC<EventFormProps> = ({ date, onClose }) => {
  const [createEvent] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      // TODO: показать тост успех
      onClose();
    },
    refetchQueries: ['getOrders'],
  });

  const form = useForm<Inputs>();

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ eventName, eventType, eventComment }) => {
      await createEvent({
        variables: {
          input: { eventName, eventType, eventComment, targetDate: date ? dayjs(date).toISOString() : '' },
        },
      });
    },
    [createEvent, date],
  );

  return (
    <div className={styles.eventFormContent}>
      <Typography variant="h1" className={styles.heading}>
        Создание нового события на&nbsp;
        <Typography component="span" variant="h1" color="primary">
          {date ? dayjs(date).format('DD.MM.YYYY') : ''}
        </Typography>
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
