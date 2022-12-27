import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useContextSelector } from 'use-context-selector';
import { gql, useMutation } from '@apollo/client';
import { Button, Container, Stack, TextField } from '@mui/material';

import { AppContext } from '../../context';
import styles from '../styles.module.scss';
import { Layout } from '../../components/Layout';

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
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      login({ userId: data?.login?.user?.userId ?? '', access_token: data?.login?.access_token ?? '' }).then(() => {
        navigate('/');
      });
    },
  });

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [navigate, userId]);

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
  return (
    <Layout>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} paddingBottom={2}>
            <TextField placeholder="name" {...register('username', { required: true })} />
            <TextField placeholder="password" {...register('password', { required: true })} />
            {(errors.username || errors.password) && <span className={styles.error}>This field is required</span>}
            <Button type="submit" variant="contained">
              Login
            </Button>
          </Stack>
        </form>
      </Container>
    </Layout>
  );
};
