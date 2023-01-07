import { FC, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useContextSelector } from 'use-context-selector';
import { Paper } from '@mui/material';

import { Nav } from '../Nav';
import { Sidebar } from '../Sidebar';
import { AppContext } from '../../context';

import styles from './styles.module.scss';

export const Layout: FC = () => {
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!userId) {
        navigate('/login', { replace: true });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [navigate, userId]);

  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className={styles.layoutMainContainer}>
      <Nav />
      {userId && (
        <Paper
          elevation={0}
          className={styles.layoutContentContainer}
          style={{ backgroundColor: `${darkMode ? '#121212' : '#F5F6F8'}` }}
        >
          <Sidebar />
          <div className={styles.layoutContent}>
            <Outlet />
          </div>
        </Paper>
      )}
    </div>
  );
};
