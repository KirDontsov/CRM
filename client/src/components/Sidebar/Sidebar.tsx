import { Link } from 'react-router-dom';
import { useState, MouseEvent } from 'react';

import { DashboardIcon } from '../Icons/DashboardIcon';

import { SidebarLink } from './SidebarLink';
import { Profile } from './Profile';
import { ROUTES } from './constants';
import styles from './styles.module.scss';

export const Sidebar = () => {
  const [active, setActive] = useState('');

  const handleEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    setActive(ROUTES.find(({ name }) => name === e.currentTarget.id)?.name ?? '');
  };

  const handleLeave = () => setActive('');

  return (
    <div className={styles.sideBar}>
      <Profile />
      <div className={styles.menuUl}>
        {ROUTES.map((route) => (
          <Link
            id={route.name}
            key={route.link}
            to={route.link}
            className={styles.link}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <DashboardIcon name={route.name} active={active} />
            <SidebarLink name={route.name} active={active} />
          </Link>
        ))}
      </div>
    </div>
  );
};
