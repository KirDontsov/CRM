import { FC } from 'react';
import { useContextSelector } from 'use-context-selector';

import { AppContext } from '../../../context';

import styles from './styles.module.scss';

export interface ContactsIconProps {
  active: boolean | string;
  link?: string;
  onEnter?: () => void;
  onLeave?: () => void;
}

export const ContactsIcon: FC<ContactsIconProps> = ({ active, link = '', onEnter, onLeave }) => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.contactsIcon}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <g clipPath="url(#clip0_5701_683)">
        <path
          d="M6.81106 6.11106C6.81106 4.34905 8.23793 2.92217 9.99994 2.92217C11.762 2.92217 13.1888 4.34905 13.1888 6.11106C13.1888 7.87307 11.762 9.29995 9.99994 9.29995C8.23793 9.29995 6.81106 7.87307 6.81106 6.11106ZM2.92217 14.8611C2.92217 14.4716 3.11169 14.0787 3.54717 13.6768C3.9874 13.2705 4.63067 12.904 5.39793 12.5966C6.93358 11.9814 8.78953 11.6722 9.99994 11.6722C11.2104 11.6722 13.0663 11.9814 14.602 12.5966C15.3692 12.904 16.0125 13.2705 16.4527 13.6768C16.8882 14.0787 17.0777 14.4716 17.0777 14.8611V17.0777H2.92217V14.8611Z"
          /* eslint-disable-next-line no-nested-ternary */
          // stroke={darkMode ? `${link === active ? '#885AF8' : '#fff'}` : `${link === active ? '#109CF1' : '#6A707E'}`}
          stroke={
            link === ''
              ? `${darkMode ? `${active ? '#885AF8' : '#fff'}` : `${active ? '#109CF1' : '#C2CFE0'}`}`
              : `${darkMode ? `${link === active ? '#885AF8' : '#fff'}` : `${link === active ? '#109CF1' : '#6A707E'}`}`
          }
          strokeWidth="1.4"
        />
      </g>
      <defs>
        <clipPath id="clip0_5701_683">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
