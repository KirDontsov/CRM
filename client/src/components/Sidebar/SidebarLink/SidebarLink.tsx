import { FC, memo } from 'react';
import { Typography } from '@mui/material';
import { useContextSelector } from 'use-context-selector';

import { AppContext } from '../../../context';

import styles from './styles.module.scss';

export interface SidebarLinkProps {
  name: string;
  link: string;
  active: string;
}
export const SidebarLink: FC<SidebarLinkProps> = memo(({ name, link, active }) => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  return (
    <Typography
      component="span"
      className={styles.link}
      color={darkMode ? `${link === active ? '#885AF8' : '#fff'}` : `${link === active ? '#109CF1' : '#6A707E'}`}
    >
      {name}
    </Typography>
  );
});
