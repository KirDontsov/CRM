import { FC, memo } from 'react';

import styles from './styles.module.scss';

export interface AvatarProps {
  name: string;
}
export const Avatar: FC<AvatarProps> = memo(({ name }) => {
  return <div className={styles.avatar}>{(name?.at(0) ?? '')?.toUpperCase()}</div>;
});
