import { FC, ReactNode } from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { Nav } from '../Nav';

import styles from './styles.module.scss';

export interface LayoutProps {
  children: ReactNode | ReactNode[];
}

export const LogoutLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Nav>
        <Link to="/" className={styles.link}>
          <Typography variant="h5" component="div">
            CRM
          </Typography>
        </Link>
      </Nav>
      <div className={styles.layoutContainer}>{children}</div>
    </>
  );
};
