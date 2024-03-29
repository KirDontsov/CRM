import { FC, memo } from 'react';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '@context';

export interface DashboardIconProps {
  link: string;
  active: string;
}

export const EventsIcon: FC<DashboardIconProps> = memo(({ link, active }) => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1152_1291)">
        <path
          d="M3 3.7H20C20.1634 3.7 20.3 3.8366 20.3 4V10C20.3 10.1634 20.1634 10.3 20 10.3H3C2.8366 10.3 2.7 10.1634 2.7 10V4C2.7 3.8366 2.8366 3.7 3 3.7ZM3 13.7H20C20.1634 13.7 20.3 13.8366 20.3 14V20C20.3 20.1634 20.1634 20.3 20 20.3H3C2.8366 20.3 2.7 20.1634 2.7 20V14C2.7 13.8366 2.8366 13.7 3 13.7Z"
          stroke={darkMode ? `${link === active ? '#885AF8' : '#fff'}` : `${link === active ? '#109CF1' : '#6A707E'}`}
          strokeWidth="1.4"
        />
      </g>
      <defs>
        <clipPath id="clip0_1152_1291">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
});
