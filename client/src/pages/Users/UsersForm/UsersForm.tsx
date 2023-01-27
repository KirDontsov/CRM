import { FC, memo, useCallback } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { FormComboBox, ComboBoxOption } from '@components/FormComboBox';
import { FormInput } from '@components/FormInput';
import { toast } from 'react-toastify';

import { OPTIONS, CREATE_USER, GET_FILIALS } from './constants';
import styles from './styles.module.scss';

type Inputs = {
  username: string;
  email: string;
  password: string;
  roles: ComboBoxOption;
  filialIds: ComboBoxOption[];
};

export interface UsersFormProps {
  onClose: () => void;
}

export const UsersForm: FC<UsersFormProps> = memo(({ onClose }) => {
  const { data } = useQuery(GET_FILIALS);
  const filials = data?.getFilials ?? [];

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      toast('Пользователь создан успешно', { type: 'success' });
      onClose();
    },
    refetchQueries: ['getUsers'],
  });

  const form = useForm<Inputs>();

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ username, email, password, roles, filialIds }) => {
      try {
        await createUser({
          variables: {
            input: {
              username,
              email,
              password,
              roles: roles?.value,
              filialIds: filialIds?.map(({ value }) => value) ?? [],
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
    [createUser],
  );

  const filialOptions = filials.map(({ id, name }: { id: string; name: string }) => ({ id, label: name, value: id }));

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
            <FormComboBox name="filialIds" label="Филиалы" required multi options={filialOptions} />
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
