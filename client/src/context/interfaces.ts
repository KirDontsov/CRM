import type { ReactNode } from 'react';

export type Maybe<V> = V | null;

export interface AuthToken {
  name: string;
  exp: number;
}

export type State = {
  userId: string | null;
  userRoles: string | null;
  exp?: number;
};

export interface UserData {
  userId: string;
  userRoles: string;
  access_token: string;
}

export interface Action {
  type: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  payload?: any;
}

export interface AppContextProviderProps {
  children: ReactNode | ReactNode[];
}

export interface AppState {
  state: {
    userId: Maybe<string>;
    userRoles: Maybe<string>;
    darkMode: boolean;
    collapsed: boolean;
  };
  handlers: {
    login: (userData: UserData) => Promise<boolean>;
    logout: () => void;
    toggleDarkMode: () => void;
    toggleCollapsed: () => void;
  };
}
