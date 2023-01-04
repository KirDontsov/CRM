import { FC, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useContextSelector } from 'use-context-selector';

import { Nav } from '../Nav';
import { Sidebar } from '../Sidebar';
import { AppContext } from '../../context';

import styles from './styles.module.scss';

export const Layout: FC = () => {
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!userId) {
        window.location.href = `${window.location.origin}/login`;
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [userId]);

  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className={styles.layoutMainContainer}>
      <Nav />
      {userId && (
        <div className={styles.layoutContentContainer}>
          <Sidebar />
          <div className={styles.layoutContent}>
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};
