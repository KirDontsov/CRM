import { FC } from 'react';
import { useContextSelector } from 'use-context-selector';

import { AppContext } from '../../../context';

import styles from './styles.module.scss';

export interface DashboardIconProps {
  link: string;
  active: string;
}

export const DashboardIcon: FC<DashboardIconProps> = ({ link, active }) => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.dashboardIcon}
    >
      <g clipPath="url(#clip0_1152_1315)">
        <path
          d="M4 12.3C3.83431 12.3 3.7 12.1657 3.7 12V4C3.7 3.83431 3.83431 3.7 4 3.7H10C10.1657 3.7 10.3 3.83431 10.3 4V12C10.3 12.1657 10.1657 12.3 10 12.3H4ZM4 20.3C3.83431 20.3 3.7 20.1657 3.7 20V16C3.7 15.8343 3.83432 15.7 4 15.7H10C10.1657 15.7 10.3 15.8343 10.3 16V20C10.3 20.1657 10.1657 20.3 10 20.3H4ZM14 20.3C13.8343 20.3 13.7 20.1657 13.7 20V12C13.7 11.8343 13.8343 11.7 14 11.7H20C20.1657 11.7 20.3 11.8343 20.3 12V20C20.3 20.1657 20.1657 20.3 20 20.3H14ZM13.7 4C13.7 3.83431 13.8343 3.7 14 3.7H20C20.1657 3.7 20.3 3.83431 20.3 4V8C20.3 8.16569 20.1657 8.3 20 8.3H14C13.8343 8.3 13.7 8.16569 13.7 8V4Z"
          stroke={darkMode ? `${link === active ? '#885AF8' : '#fff'}` : `${link === active ? '#109CF1' : '#6A707E'}`}
          strokeWidth="1.4"
        />
      </g>
      <defs>
        <clipPath id="clip0_1152_1315">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
