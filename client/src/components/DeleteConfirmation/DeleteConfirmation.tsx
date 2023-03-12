import { Curtain } from '@components/Curtain';
import { FC, memo } from 'react';
import { Button, Typography } from '@mui/material';

import styles from './styles.module.scss';

export interface DeleteConfirmationProps {
  onClose: () => void;
  onSubmit: () => void;
}

export const DeleteConfirmation: FC<DeleteConfirmationProps> = memo(({ onClose, onSubmit }) => {
  return (
    <Curtain onClose={onClose}>
      <div className={styles.deleteConfirmationContent}>
        <Typography variant="h1" className={styles.heading}>
          Вы уверены что хотите удалить выбранные сущности?
        </Typography>
        <div className={styles.bottons}>
          <Button variant="outlined" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="contained" onClick={onSubmit}>
            Удалить
          </Button>
        </div>
      </div>
    </Curtain>
  );
});
