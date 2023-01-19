import { FC, ReactNode } from 'react';
import { Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '@context';

import { Nav } from '../Nav';

import styles from './styles.module.scss';

export interface LayoutProps {
  children: ReactNode | ReactNode[];
}

export const LogoutLayout: FC<LayoutProps> = ({ children }) => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  return (
    <>
      <Nav>
        <Link to="/" className={styles.link}>
          <Typography variant="h5" component="div" color={darkMode ? '#fff' : '#6A707E'}>
            Best Light
          </Typography>
        </Link>
      </Nav>
      <Paper elevation={0} className={styles.layoutContainer}>
        {children}
      </Paper>
    </>
  );
};
