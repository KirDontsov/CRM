import { FC } from 'react';
import { useContextSelector } from 'use-context-selector';

import { AppContext } from '../../../context';

import styles from './styles.module.scss';

export interface ContactsIconProps {
  active: boolean | string;
}

export const ToggleIcon: FC<ContactsIconProps> = ({ active }) => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  return (
    <span className={styles.toggleIcon}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1152_1323)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 0C0.895431 0 0 0.89543 0 2V12C0 13.1046 0.89543 14 2 14H12C13.1046 14 14 13.1046 14 12V2C14 0.895431 13.1046 0 12 0H2ZM5 2C4.44772 2 4 2.44772 4 3V11C4 11.5523 4.44772 12 5 12C5.55228 12 6 11.5523 6 11V3C6 2.44772 5.55228 2 5 2Z"
            fill={darkMode ? `${active ? '#885AF8' : '#fff'}` : `${active ? '#109CF1' : '#6A707E'}`}
          />
        </g>
        <defs>
          <clipPath id="clip0_1152_1323">
            <rect width="14" height="14" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </span>
  );
};
