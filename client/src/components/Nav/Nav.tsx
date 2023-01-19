import { FC, ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Paper } from '@mui/material';

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
    <Paper elevation={1} className={styles.nav}>
      <div className={styles.navContent}>
        <div>{children || null}</div>
        <div className={styles.navRight}>
          <Link to="/login" className={`${styles.loginLink} ${styles.link}`}>
            <ContactsIcon active={active} onEnter={handleEnter} onLeave={handleLeave} />
          </Link>
        </div>
      </div>
    </Paper>
  );
};
