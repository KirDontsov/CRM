import { useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

import { initialState, localStorageAppPrefix } from './constants';
import type { AppState, AuthToken, State, UserData, Action } from './interfaces';

const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        userId: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        userId: null,
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
      accessToken: token,
    };
  }
  return { userId: null, accessToken: null };
};

export function useAppState(): AppState {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (userData: UserData) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token, userId } = userData;
    localStorage.setItem(`${localStorageAppPrefix}.token`, access_token);
    localStorage.setItem(`${localStorageAppPrefix}.userId`, userId);
    dispatch({
      type: 'LOGIN',
      payload: userId,
    });
    return !!state.userId;
  };

  const logout = () => {
    localStorage.removeItem(`${localStorageAppPrefix}.token`);
    dispatch({
      type: 'LOGOUT',
    });
  };

  useEffect(() => {
    const { userId, accessToken } = checkAuthToken();
    if (accessToken && userId) {
      dispatch({
        type: 'LOGIN',
        payload: userId,
      });
    } else if ((!accessToken || !userId) && window.location.href !== `${window.location.origin}/login`) {
      logout();
      window.location.href = `${window.location.origin}/login`;
    }
  }, []);

  return {
    state,
    handlers: {
      login,
      logout,
    },
  };
}
