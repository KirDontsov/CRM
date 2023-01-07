import { Link, useLocation } from 'react-router-dom';
import { useState, useCallback, useEffect, MouseEvent, useRef } from 'react';
import { Paper, Typography } from '@mui/material';
import { useContextSelector } from 'use-context-selector';

import { DashboardIcon } from '../Icons/DashboardIcon';
import { ContactsIcon } from '../Icons/ContactsIcon';
import { SettingsIcon } from '../Icons/SettingsIcon';
import { ToggleIcon } from '../Icons/ToggleIcon';
import { AppContext } from '../../context';
import { UserRoles } from '../../apollo-client';

import { SidebarLink } from './SidebarLink';
import { Profile } from './Profile';
import { ROUTES } from './constants';
import { useHover } from './hooks';
import styles from './styles.module.scss';

export const Sidebar = () => {
  const [active, setActive] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const hoverRef = useRef(null);
  const isHovered = useHover(hoverRef);
  const userRoles = useContextSelector(AppContext, (ctx) => ctx.state.userRoles);
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);

  useEffect(() => {
    if (!isHovered) {
      setActive(pathname);
    }
  }, [isHovered, pathname]);

  const handleEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    setActive(ROUTES.find(({ link }) => link === e.currentTarget.id)?.link ?? '');
  };

  const handleLeave = () => {
    if (!isHovered) {
      setActive(pathname);
    }
  };

  const renderIcon = useCallback(
    (link: string) => {
      switch (link) {
        case '/dashboard':
          return <DashboardIcon link={link} active={active} />;
        case '/users':
          return <ContactsIcon link={link} active={active} />;
        case '/settings':
          return <SettingsIcon link={link} active={active} />;
        default:
          return <DashboardIcon link={link} active={active} />;
      }
    },
    [active],
  );

  return (
    <Paper elevation={2} className={`${styles.sideBar} ${collapsed ? styles.sideBarCollapsed : ''}`}>
      <Link to="/" className={styles.link}>
        <Typography variant="h5" component="div" color={darkMode ? '#fff' : '#6A707E'}>
          {collapsed ? `BL` : `Best Light`}
        </Typography>
      </Link>
      <Profile collapsed={collapsed} />
      <div className={`${styles.menuUl} ${collapsed ? styles.menuUlCollapsed : ''}`} ref={hoverRef}>
        {ROUTES.filter(
          ({ link, access }) => link !== '/settings' && access.includes((userRoles ?? '') as UserRoles),
        ).map((route) => (
          <Link
            id={route.link}
            key={route.link}
            to={route.link}
            className={`${styles.link} ${!collapsed ? styles.sidebarLink : ''}`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <>
              {renderIcon(route.link)}
              {!collapsed && <SidebarLink link={route.link} name={route.name} active={active} />}
            </>
          </Link>
        ))}

        <div className={styles.divider} />
        <div className={styles.bottomMenuUl}>
          <Link
            id="/settings"
            to="/settings"
            className={`${styles.link} ${!collapsed ? styles.sidebarLink : ''}`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <>
              {renderIcon('/settings')}
              {!collapsed && <SidebarLink link="/settings" name="Настройки" active={active} />}
            </>
          </Link>
          <div
            role="presentation"
            className={`${styles.link} ${!collapsed ? styles.sidebarLink : ''} ${styles.bottomMenuLink}`}
            onClick={() => setCollapsed((prev) => !prev)}
          >
            <ToggleIcon active={collapsed} />
            {!collapsed && (
              <Typography
                component="span"
                className={`${styles.link} ${!collapsed ? styles.sidebarLink : ''}`}
                color={darkMode ? '#fff' : '#6A707E'}
              >
                Свернуть
              </Typography>
            )}
          </div>
        </div>
      </div>
    </Paper>
  );
};
