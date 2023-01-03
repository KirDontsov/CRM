import { FC } from 'react';

import styles from './styles.module.scss';

export interface AvatarProps {
  name: string;
}
export const Avatar: FC<AvatarProps> = ({ name }) => {
  return <div className={styles.avatar}>{(name?.at(0) ?? '')?.toUpperCase()}</div>;
};
