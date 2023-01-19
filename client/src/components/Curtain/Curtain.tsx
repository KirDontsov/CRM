import { FC, memo, ReactNode } from 'react';
import Drawer from '@mui/material/Drawer';

import styles from './styles.module.scss';

export interface CurtainProps {
  onClose: () => void;
  children: ReactNode | ReactNode[];
}

export const Curtain: FC<CurtainProps> = memo(({ onClose, children }) => (
  <Drawer anchor="right" open onClose={onClose}>
    <div className={styles.drawerContent}>{children}</div>
  </Drawer>
));
