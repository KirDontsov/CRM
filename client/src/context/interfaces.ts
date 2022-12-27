import type { ReactNode } from 'react';

export type Maybe<V> = V | null;

export interface AuthToken {
  name: string;
  exp: number;
}

export type State = {
  userId: string | null;
  exp?: number;
};

export interface UserData {
  userId: string;
  access_token: string;
}

export interface Action {
  type: string;
  payload?: any;
}

export interface AppContextProviderProps {
  children: ReactNode | ReactNode[];
}

export interface AppState {
  state: {
    userId: Maybe<string>;
  };
  handlers: {
    login: (userData: UserData) => Promise<boolean>;
    logout: () => void;
  };
}
