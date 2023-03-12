import { FC, memo } from 'react';
import { Message } from '@pages/Chat/Chat';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '@context';
import { Paper, Typography } from '@mui/material';
import { Profile } from '@components/Profile';

import styles from './messages.module.scss';

export interface MessagesProps {
  messages: Message[];
  toUserId: string;
}

export const Messages: FC<MessagesProps> = memo(({ messages, toUserId }) => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);

  return (
    <div className={styles.messagesContainer}>
      {userId === toUserId && <Typography variant="h1">Личные заметки</Typography>}
      {userId !== toUserId && <Profile toUserId={toUserId} />}
      <Paper elevation={2} className={styles.messages}>
        {Boolean(messages?.length) &&
          messages.map(({ message, id, fromUserId }) => (
            <div
              key={id}
              className={styles.message}
              style={{
                ...(fromUserId === userId
                  ? { borderRadius: '12px 12px 0 12px', alignSelf: 'flex-end' }
                  : { borderRadius: '12px 12px 12px 0' }),
                backgroundColor: darkMode ? '#885AF8' : '#109CF1',
              }}
            >
              <Typography component="p">{message}</Typography>
            </div>
          ))}
      </Paper>
    </div>
  );
});
