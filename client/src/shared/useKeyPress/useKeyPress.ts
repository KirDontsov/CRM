import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export function useKeyPress(key: string, action: Function) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) action();
    };
    window.addEventListener('keyup', handler);
    return () => window.removeEventListener('keyup', handler);
  });
}
