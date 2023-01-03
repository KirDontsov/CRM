import { useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';

import { LogoutLayout } from '../../components/LogoutLayout';

import styles from './styles.module.scss';

const REGISTER_USER = gql`
  mutation RegisterUser($input: CreateUserInput!) {
    signup(createUserInput: $input) {
      userId
      username
      email
    }
  }
`;

type Inputs = {
  username: string;
  email: string;
  password: string;
};

export const Register = () => {
  const navigate = useNavigate();

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      // TODO: показать тост успех
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
      const { username, email, password } = data;
      await registerUser({
        variables: {
          input: { username, email, password },
        },
      });
    },
    [registerUser],
  );

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LogoutLayout>
        <Container maxWidth="sm">
          <Typography component="h1" className={styles.heading}>
            Регистрация
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} paddingBottom={2}>
              <TextField variant="outlined" label="Name" {...register('username', { required: true })} />
              <TextField variant="outlined" label="Email" {...register('email', { required: true })} />
              <TextField variant="outlined" label="Password" {...register('password', { required: true })} />
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
