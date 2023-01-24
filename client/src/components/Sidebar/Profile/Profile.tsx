import { FC, memo } from 'react';
import { useQuery } from '@apollo/client';
import { useContextSelector } from 'use-context-selector';
import { Typography } from '@mui/material';
import { AppContext } from '@context';

import { UserData } from './interfaces';
import { Avatar } from './Avatar';
import { GET_USER } from './constants';
import styles from './styles.module.scss';

export interface ProfileProps {
  collapsed: boolean;
}

export const Profile: FC<ProfileProps> = memo(({ collapsed }) => {
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);

  const { data } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
  });

  const { username, email, filials }: UserData = data?.getUser ?? {};

  return (
    <div className={styles.profileContainer}>
      <Avatar name={username} />
      {!collapsed && (
        <div className={styles.contactsContainer}>
          <Typography component="span" className={styles.name}>
            {username}
          </Typography>
          <a href={`mailto:${email}`} className={styles.link}>
            <Typography component="span" className={styles.email} color={darkMode ? '#885AF8' : '#C2CFE0'}>
              {email}
            </Typography>
          </a>
          <Typography component="span" className={styles.filial} color={darkMode ? '#885AF8' : '#C2CFE0'}>
            {filials?.map(({ name }) => name).join(', ')}
          </Typography>
        </div>
      )}
    </div>
  );
});
