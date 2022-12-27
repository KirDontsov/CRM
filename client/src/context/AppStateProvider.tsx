import type { FC } from 'react';

import { useAppState } from './useAppState';
import { AppContext } from './context';
import type { AppContextProviderProps } from './interfaces';

export const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => (
  <AppContext.Provider value={useAppState()}>{children}</AppContext.Provider>
);
