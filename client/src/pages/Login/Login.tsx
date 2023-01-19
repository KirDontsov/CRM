import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useContextSelector } from 'use-context-selector';
import { useMutation } from '@apollo/client';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { LogoutLayout } from '@components/LogoutLayout';
import { AppContext } from '@context';
import { toast } from 'react-toastify';
import { LOGIN_USER } from '@pages/Login/constants';

import styles from './styles.module.scss';

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
      login({
        userId: data?.login?.user?.id ?? '',
        userRoles: data?.login?.user?.roles ?? '',
        access_token: data?.login?.access_token ?? '',
      }).then(() => {
        if (!data?.login?.user?.id) {
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
      try {
        await loginUser({
          variables: {
            input: { username, password },
          },
        });
      } catch (e) {
        // @ts-ignore
        toast(`Произошла ошибка: ${e?.message ?? ''}`, {
          type: 'error',
        });
      }
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
          <>
            <div className={styles.heading}>
              <Typography variant="h1" className={styles.typo}>
                Вход в систему
              </Typography>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2} paddingBottom={2}>
                <TextField label="Имя" {...register('username', { required: true })} />
                <TextField label="Пароль" {...register('password', { required: true })} />
                {(errors.username || errors.password) && (
                  <span className={styles.error}>Все поля обязательны к заполнению</span>
                )}
                <Button type="submit" variant="contained">
                  Войти в систему
                </Button>
              </Stack>
            </form>
          </>
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
