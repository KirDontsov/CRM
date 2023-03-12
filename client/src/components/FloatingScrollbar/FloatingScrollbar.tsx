import { FC, useEffect, useRef } from 'react';
import { remToPixels } from '@src/shared/utils';
import { Box } from '@mui/material';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '@context';

import styles from './styles.module.scss';
import type { FloatingScrollbarProps } from './interfaces';

export const FloatingScrollbar: FC<FloatingScrollbarProps> = ({ containerElementId, innerElementId }) => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.getElementById(containerElementId);
    const innerElement = document.getElementById(innerElementId);
    const scroll = ref.current;

    if (container && innerElement && scroll) {
      const resizeObserver = new ResizeObserver(() => {
        const { left, width } = container.getBoundingClientRect();
        const { width: innerElementWidth } = innerElement.getBoundingClientRect();
        scroll.style.left = `${left}px`;
        scroll.style.width = `${width}px`;
        scroll.style.transformOrigin = 'center';
        scroll.style.transform = `scale(${(width - remToPixels(7)) / width})`;
        (scroll.firstElementChild as HTMLDivElement).style.width = `${innerElementWidth}px`;
      });

      let scrollingTarget: number | null = null;
      let containerScrollingTarget: number | null = null;
      const scrollHandler = () => {
        if (scroll.scrollLeft !== containerScrollingTarget) {
          scrollingTarget = scroll.scrollLeft;
          containerScrollingTarget = null;
          container.scrollLeft = scroll.scrollLeft;
        }
      };

      const containerScrollHandler = () => {
        if (container.scrollLeft !== scrollingTarget) {
          scroll.scrollLeft = container.scrollLeft;
          containerScrollingTarget = container.scrollLeft;
          scrollingTarget = null;
        }
      };

      scroll.addEventListener('scroll', scrollHandler);
      container.addEventListener('scroll', containerScrollHandler);

      resizeObserver.observe(container);
      resizeObserver.observe(innerElement);
      return () => {
        scroll.removeEventListener('scroll', scrollHandler);
        container.removeEventListener('scroll', containerScrollHandler);
        resizeObserver.unobserve(container);
        resizeObserver.unobserve(innerElement);
      };
    }
    return undefined;
  }, [containerElementId, innerElementId]);

  return (
    <Box
      sx={{
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: `${darkMode ? '#242526' : '#F5F6F8'}`,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: `${darkMode ? '#885AF8' : '#242526'}`,
          borderRadius: 2,
        },
      }}
      ref={ref}
      className={styles.floatingScrollbar}
    >
      <div style={{ height: '6px' }} />
    </Box>
  );
};
