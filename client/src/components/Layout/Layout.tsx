import { FC, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useContextSelector } from 'use-context-selector';
import { Box, Paper } from '@mui/material';
import { AppContext } from '@context';

import { Nav } from '../Nav';
import { Sidebar } from '../Sidebar';

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
          style={{ backgroundColor: `${darkMode ? '#242526' : '#F5F6F8'}` }}
        >
          <Sidebar />
          <Box
            className={styles.layoutContent}
            sx={{
              '&::-webkit-scrollbar': {
                width: 6,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: `${darkMode ? '#242526' : '#F5F6F8'}`,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: `${darkMode ? '#885AF8' : '#242526'}`,
                borderRadius: 2,
              },
            }}
          >
            <Outlet />
          </Box>
        </Paper>
      )}
    </div>
  );
};
