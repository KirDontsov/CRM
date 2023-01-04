import { Link, useLocation } from 'react-router-dom';
import { useState, useCallback, useEffect, MouseEvent, useRef, RefObject, useLayoutEffect } from 'react';
import { Typography } from '@mui/material';

import { DashboardIcon } from '../Icons/DashboardIcon';
import { ContactsIcon } from '../Icons/ContactsIcon';
import { SettingsIcon } from '../Icons/SettingsIcon';
import { ToggleIcon } from '../Icons/ToggleIcon';

import { SidebarLink } from './SidebarLink';
import { Profile } from './Profile';
import { ROUTES } from './constants';
import styles from './styles.module.scss';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Element Event based useEventListener interface
function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLDivElement>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
): void;

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | MediaQueryList | void = void,
>(
  eventName: KW | KH | KM,
  handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | MediaQueryListEventMap[KM] | Event) => void,
  element?: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement: T | Window = element?.current ?? window;

    if (!(targetElement && targetElement.addEventListener)) return;

    const listener: typeof handler = (event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, listener, options);
    // eslint-disable-next-line consistent-return
    return () => targetElement.removeEventListener(eventName, listener, options);
  }, [eventName, element, options]);
}

function useHover<T extends HTMLElement = HTMLElement>(elementRef: RefObject<T>): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);

  useEventListener('mouseenter', handleMouseEnter, elementRef);
  useEventListener('mouseleave', handleMouseLeave, elementRef);

  return value;
}

export const Sidebar = () => {
  const [active, setActive] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const hoverRef = useRef(null);
  const isHovered = useHover(hoverRef);

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
    (name: string) => {
      switch (name) {
        case '/dashboard':
          return <DashboardIcon name={name} active={active} />;
        case '/users':
          return <ContactsIcon name={name} active={active} />;
        case '/settings':
          return <SettingsIcon name={name} active={active} />;
        default:
          return <DashboardIcon name={name} active={active} />;
      }
    },
    [active],
  );

  return (
    <div className={`${styles.sideBar} ${collapsed ? styles.sideBarCollapsed : ''}`}>
      <Profile collapsed={collapsed} />
      <div className={`${styles.menuUl} ${collapsed ? styles.menuUlCollapsed : ''}`} ref={hoverRef}>
        {ROUTES.filter(({ link }) => link !== '/settings').map((route) => (
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
              <Typography component="span" className={`${styles.link} ${!collapsed ? styles.sidebarLink : ''}`}>
                Свернуть
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
