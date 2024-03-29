import { useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { LogoutLayout } from '@components/LogoutLayout';
import { toast } from 'react-toastify';

import styles from './styles.module.scss';

const REGISTER_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
      username
      email
      roles
    }
  }
`;

type Inputs = {
  username: string;
  email: string;
  password: string;
  roles: string;
};

export const Register = () => {
  const navigate = useNavigate();

  const [createUser] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      toast('Пользователь создан успешно', { type: 'success' });
      navigate('/login');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      const { username, email, password, roles } = data;
      try {
        await createUser({
          variables: {
            input: { username, email, password, roles },
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

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LogoutLayout>
        <Container maxWidth="sm">
          <Typography variant="h1" className={styles.heading}>
            Регистрация
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} paddingBottom={2}>
              <TextField variant="outlined" label="Имя" {...register('username', { required: true })} />
              <TextField variant="outlined" label="Email" {...register('email', { required: true })} />
              <TextField variant="outlined" label="Пароль" {...register('password', { required: true })} />
              <TextField variant="outlined" label="Роль" {...register('roles', { required: true })} />
              {(errors.username || errors.email || errors.password) && (
                <span className={styles.error}>Все поля обязательны к заполнению</span>
              )}
              <Button type="submit" variant="contained">
                Зарегестрироваться
              </Button>
            </Stack>
          </form>
        </Container>
      </LogoutLayout>
    </Suspense>
  );
};
