import { FC, ReactNode, useState } from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { ContactsIcon } from '../Icons/ContactsIcon';

import styles from './styles.module.scss';

export interface NavProps {
  children?: ReactNode | ReactNode[];
}
export const Nav: FC<NavProps> = ({ children }) => {
  const [active, setActive] = useState(false);

  const handleEnter = () => {
    setActive(true);
  };

  const handleLeave = () => setActive(false);
  return (
    <div className={styles.nav}>
      <div className={styles.navContent}>
        <div>{children || null}</div>
        <div className={styles.navRight}>
          <Link to="/login" className={`${styles.loginLink} ${styles.link}`}>
            <ContactsIcon active={active} onEnter={handleEnter} onLeave={handleLeave} />
          </Link>
          <Link to="/register" className={styles.link}>
            <Typography component="span">Регистрация</Typography>
          </Link>
        </div>
      </div>
    </div>
  );
};
