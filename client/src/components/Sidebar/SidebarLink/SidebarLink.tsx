import { FC, memo } from 'react';
import { Typography } from '@mui/material';

import styles from './styles.module.scss';

export interface SidebarLinkProps {
  name: string;
  link: string;
  active: string;
}
export const SidebarLink: FC<SidebarLinkProps> = memo(({ name, link, active }) => (
  <Typography component="span" className={styles.link} color={link === active ? '#109CF1' : '#6A707E'}>
    {name}
  </Typography>
));
