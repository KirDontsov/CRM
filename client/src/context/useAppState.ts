import { useCallback, useEffect, useReducer, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { client } from '@src/apollo-client/provider/Provider';

import { initialState, localStorageAppPrefix } from './constants';
import type { AppState, AuthToken, State, UserData, Action } from './interfaces';

const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        ...action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        userId: null,
        userRoles: null,
        filialIds: null,
      };
    default:
      return state;
  }
};

const checkAuthToken = () => {
  // проверка на срок действия токена и его удаление из хранилища если он просрочен
  const token = localStorage.getItem(`${localStorageAppPrefix}.token`) ?? '';
  if (token) {
    const decodedToken = jwtDecode<AuthToken>(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem(`${localStorageAppPrefix}.token`);
    }
    return {
      userId: localStorage.getItem(`${localStorageAppPrefix}.userId` ?? null),
      userRoles: localStorage.getItem(`${localStorageAppPrefix}.userRoles` ?? null),
      filialIds: JSON.parse(localStorage.getItem(`${localStorageAppPrefix}.filialIds` ?? null) ?? ''),
      accessToken: token,
    };
  }
  return { userId: null, userRoles: null, accessToken: null };
};

export function useAppState(): AppState {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [darkMode, setDarkMode] = useState(() => !!localStorage.getItem(`${localStorageAppPrefix}.darkMode`));
  const [collapsed, setCollapsed] = useState(false);

  const handleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
    if (darkMode) {
      localStorage.removeItem(`${localStorageAppPrefix}.darkMode`);
    } else {
      localStorage.setItem(`${localStorageAppPrefix}.darkMode`, `true`);
    }
  }, [darkMode]);

  const handleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const login = async (userData: UserData) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token, userId, userRoles, filialIds } = userData;
    localStorage.setItem(`${localStorageAppPrefix}.token`, access_token);
    localStorage.setItem(`${localStorageAppPrefix}.userRoles`, userRoles);
    localStorage.setItem(`${localStorageAppPrefix}.userId`, userId);
    localStorage.setItem(`${localStorageAppPrefix}.filialIds`, JSON.stringify(filialIds));
    dispatch({
      type: 'LOGIN',
      payload: { userId, userRoles, filialIds },
    });
    return !!state.userId;
  };

  const logout = async () => {
    localStorage.removeItem(`${localStorageAppPrefix}.token`);
    localStorage.removeItem(`${localStorageAppPrefix}.userRoles`);
    localStorage.removeItem(`${localStorageAppPrefix}.userId`);
    localStorage.removeItem(`${localStorageAppPrefix}.filialIds`);
    await client.resetStore();
    dispatch({
      type: 'LOGOUT',
    });
  };

  useEffect(() => {
    const { userId, userRoles, accessToken, filialIds } = checkAuthToken();
    if (accessToken && userId) {
      dispatch({
        type: 'LOGIN',
        payload: { userId, userRoles, filialIds },
      });
    } else if ((!accessToken || !userId) && window.location.href !== `${window.location.origin}/login`) {
      logout().then();
      window.location.href = `${window.location.origin}/login`;
    }
  }, []);

  return {
    state: {
      ...state,
      darkMode,
      collapsed,
    },
    handlers: {
      login,
      logout,
      toggleDarkMode: handleDarkMode,
      toggleCollapsed: handleCollapsed,
    },
  };
}
