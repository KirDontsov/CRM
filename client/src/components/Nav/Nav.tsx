import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { ContactsIcon } from '../Icons/ContactsIcon';

import styles from './styles.module.scss';

export const Nav = () => {
  const [active, setActive] = useState(false);

  const handleEnter = () => {
    setActive(true);
  };

  const handleLeave = () => setActive(false);
  return (
    <div className={styles.nav}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.link}>
          <Typography variant="h5" component="div">
            CRM
          </Typography>
        </Link>

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
