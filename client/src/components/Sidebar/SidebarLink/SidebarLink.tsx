import { Typography } from '@mui/material';
import { FC } from 'react';

import styles from './styles.module.scss';

export interface SidebarLinkProps {
  name: string;
  active: string;
}
export const SidebarLink: FC<SidebarLinkProps> = ({ name, active }) => (
  <Typography component="span" className={styles.link} color={name === active ? '#109CF1' : '#6A707E'}>
    {name}
  </Typography>
);
