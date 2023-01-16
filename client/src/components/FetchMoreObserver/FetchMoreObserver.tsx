import { FC, memo, useRef } from 'react';
import { Maybe } from '@context';
import { useIntersectionObserver } from '@src/shared/useIntersectionObserver';
import { CircularProgress } from '@mui/material';

export interface FetchMoreObserverProps {
  fetchMore: () => void;
  fetchMoreLoading: boolean;
  itemsLength: number;
  totalCount: number;
}
export const FetchMoreObserver: FC<FetchMoreObserverProps> = memo(
  ({ fetchMore, fetchMoreLoading, itemsLength, totalCount }) => {
    const observerRef = useRef<Maybe<HTMLDivElement>>(null);

    useIntersectionObserver({
      ref: observerRef,
      callback: fetchMore as unknown as () => boolean,
    });

    return (
      <>
        {!fetchMoreLoading && itemsLength < totalCount && <div ref={observerRef} />}
        {fetchMoreLoading && (
          <div>
            <CircularProgress />
          </div>
        )}
      </>
    );
  },
);
