import { FC, ReactNode } from 'react';

import { Nav } from '../Nav';

import styles from './styles.module.scss';

export interface LayoutProps {
  children: ReactNode | ReactNode[];
}

export const LogoutLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Nav />
      <div className={styles.layoutContainer}>{children}</div>
    </>
  );
};
