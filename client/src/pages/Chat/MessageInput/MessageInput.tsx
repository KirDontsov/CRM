import { FC, memo, useCallback } from 'react';
import { FormInput } from '@components/FormInput';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useKeyPress } from '@src/shared/useKeyPress';

import styles from './messageInput.module.scss';

export interface Inputs {
  message: string;
}

export interface MessageInputProps {
  send: (message: string) => void;
}

export const MessageInput: FC<MessageInputProps> = memo(({ send }) => {
  const form = useForm<Inputs>();
  const { formState, handleSubmit, reset } = form;
  const { isDirty } = formState;

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    ({ message }) => {
      send(message);
      reset();
    },
    [send, reset],
  );

  useKeyPress('enter', onSubmit);

  return (
    <Paper elevation={2}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
          <FormInput name="message" label="Сообщение..." className={styles.input} />
          <IconButton type="submit" disabled={!isDirty} color="primary" size="large" aria-label="Отправить">
            <SendIcon />
          </IconButton>
        </form>
      </FormProvider>
    </Paper>
  );
});
