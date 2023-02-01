import { FC, memo, useCallback } from 'react';
import { FormInput } from '@components/FormInput';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { Button } from '@mui/material';

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

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <FormInput name="message" label="message" className={styles.input} />
        <div className={styles.bottom}>
          <Button type="submit" variant="contained" disabled={!isDirty}>
            Отправить
          </Button>
        </div>
      </form>
    </FormProvider>
  );
});
