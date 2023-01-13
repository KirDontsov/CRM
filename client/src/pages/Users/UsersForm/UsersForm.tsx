import { FC, memo, useCallback } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { FormComboBox, ComboBoxOption } from '@components/FormComboBox';
import { FormInput } from '@components/FormInput';

import { OPTIONS, CREATE_USER } from './constants';
import styles from './styles.module.scss';

type Inputs = {
  username: string;
  email: string;
  password: string;
  roles: ComboBoxOption;
};

export interface UsersFormProps {
  onClose: () => void;
}

export const UsersForm: FC<UsersFormProps> = memo(({ onClose }) => {
  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      // TODO: показать тост успех
      onClose();
    },
    refetchQueries: ['getUsers'],
  });

  const form = useForm<Inputs>();

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ username, email, password, roles }) => {
      await createUser({
        variables: {
          input: { username, email, password, roles: roles?.value },
        },
      });
    },
    [createUser],
  );

  return (
    <div className={styles.usersFormContent}>
      <Typography variant="h1" className={styles.heading}>
        Создание нового пользователя
      </Typography>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} paddingBottom={2}>
            <FormInput name="username" label="Имя" required />
            <FormInput name="email" label="Email" required />
            <FormInput name="password" label="Пароль" required />
            <FormComboBox name="roles" label="Роль" required options={OPTIONS} />
          </Stack>
          <div className={styles.bottom}>
            <Button type="submit" variant="contained">
              Создать пользователя
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
});
