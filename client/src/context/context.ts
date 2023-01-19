import { createContext } from 'use-context-selector';

import type { AppState } from './interfaces';

export const AppContext = createContext<AppState>(null!);
