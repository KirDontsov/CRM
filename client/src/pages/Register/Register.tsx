import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { Button, Container, Stack, TextField } from '@mui/material';

import styles from '../styles.module.scss';
import { Layout } from '../../components/Layout';

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
    <Layout>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} paddingBottom={2}>
            <TextField variant="outlined" label="Name" {...register('username', { required: true })} />
            <TextField variant="outlined" label="Email" {...register('email', { required: true })} />
            <TextField variant="outlined" label="Password" {...register('password', { required: true })} />
            {(errors.username || errors.email || errors.password) && (
              <span className={styles.error}>This field is required</span>
            )}
            <Button type="submit" variant="contained">
              Register
            </Button>
          </Stack>
        </form>
      </Container>
    </Layout>
  );
};
