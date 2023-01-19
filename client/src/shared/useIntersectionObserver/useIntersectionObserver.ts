import { useEffect, RefObject } from 'react';

type UseIntersectionObserverParams = {
  /** Наблюдаемый элемент */
  ref: RefObject<HTMLElement | undefined>;
  /** Вызываемая функция при выполнении условия */
  callback: () => boolean;
  /** настройки для IntersectionObserver */
  options?: IntersectionObserverInit;
};

/**
 * Позволяет отслеживать появление элемента в области
 *
 * @param ref - наблюдаемый элемент
 * @param callback - вызываемая функция при выполнении условия
 * @param options - настройки для IntersectionObserver
 */
export const useIntersectionObserver = ({ ref, callback, options = {} }: UseIntersectionObserverParams): void => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (callback()) {
              observer.disconnect();
            }
          }
        });
      },
      {
        root: null,
        threshold: 0,
        ...options,
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);
};
