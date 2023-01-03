import { gql, useQuery } from '@apollo/client';
import { useContextSelector } from 'use-context-selector';
import { Typography } from '@mui/material';

import { AppContext } from '../../../context';

import { Avatar } from './Avatar';
import styles from './styles.module.scss';

const GET_USER = gql`
  query getUser($id: String!) {
    user(id: $id) {
      userId
      username
      email
    }
  }
`;

export const Profile = () => {
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);

  const { data } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
  });

  const username = data?.user?.username ?? '';
  const email = data?.user?.email ?? '';

  return (
    <div className={styles.profileContainer}>
      <Avatar name={username} />
      <div className={styles.contactsContainer}>
        <Typography component="span" className={styles.name}>
          {username}
        </Typography>
        <a href={`mailto:${email}`} className={styles.link}>
          <Typography component="span" className={styles.email}>
            {email}
          </Typography>
        </a>
      </div>
    </div>
  );
};
