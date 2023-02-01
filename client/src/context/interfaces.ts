import type { ReactNode } from 'react';

export type Maybe<V> = V | null;

export interface AuthToken {
  name: string;
  exp: number;
}

export type State = {
  userId: Maybe<string>;
  userRoles: Maybe<string>;
  filialIds: Maybe<string>;
  exp?: number;
};

export interface UserData {
  userId: string;
  userRoles: string;
  access_token: string;
  filialIds: string[];
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
    filialIds: Maybe<string>;
    darkMode: boolean;
    collapsed: boolean;
  };
  handlers: {
    login: (userData: UserData) => Promise<boolean>;
    logout: () => Promise<void>;
    toggleDarkMode: () => void;
    toggleCollapsed: () => void;
  };
}
