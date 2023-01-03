import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useContextSelector } from 'use-context-selector';
import { gql, useMutation } from '@apollo/client';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import { LogoutLayout } from '../../components/LogoutLayout';
import { AppContext } from '../../context';

import styles from './styles.module.scss';

const LOGIN_USER = gql`
  mutation login($input: LoginUserInput!) {
    login(loginUserInput: $input) {
      user {
        userId
      }
      access_token
    }
  }
`;

type Inputs = {
  username: string;
  password: string;
};

export const Login = () => {
  const navigate = useNavigate();
  const login = useContextSelector(AppContext, (ctx) => ctx.handlers.login);
  const logout = useContextSelector(AppContext, (ctx) => ctx.handlers.logout);
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      login({ userId: data?.login?.user?.userId ?? '', access_token: data?.login?.access_token ?? '' }).then(() => {
        if (!data?.login?.user?.userId) {
          navigate('/login');
        }
        navigate('/');
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (formData) => {
      const { username, password } = formData;
      await loginUser({
        variables: {
          input: { username, password },
        },
      });
    },
    [loginUser],
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <LogoutLayout>
      <Container maxWidth="sm">
        {!userId ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} paddingBottom={2}>
              <TextField placeholder="name" {...register('username', { required: true })} />
              <TextField placeholder="password" {...register('password', { required: true })} />
              {(errors.username || errors.password) && (
                <span className={styles.error}>Все поля обязательны к заполнению</span>
              )}
              <Button type="submit" variant="contained">
                Войти в систему
              </Button>
            </Stack>
          </form>
        ) : (
          <div className={styles.heading}>
            <Typography component="h2" className={styles.typo}>
              Вы уже вошли в систему
            </Typography>
            <Button type="submit" variant="contained" endIcon={<LogoutIcon />} onClick={handleLogout}>
              Выйти из системы
            </Button>
          </div>
        )}
      </Container>
    </LogoutLayout>
  );
};
