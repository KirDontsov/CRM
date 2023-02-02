import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '@context';
import { ComboBoxOption } from '@components/FormComboBox';
import { useParams } from 'react-router-dom';

import { Messages } from './Messages';
import { MessageInput } from './MessageInput';
import styles from './chat.module.scss';

export interface Message {
  id: string;
  message: string;
  fromUserId: string;
  toUserId: string;
  createdAt?: Date;
}

export interface Inputs {
  toUserId: ComboBoxOption;
}

export const Chat = () => {
  const { userId: toUserId } = useParams<{ userId: string }>();
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[]>([]);

  const send = useCallback(
    (value: string) => {
      socket?.emit('createMessage', {
        message: value,
        fromUserId: userId,
        toUserId,
      });
    },
    [socket, toUserId, userId],
  );

  useEffect(() => {
    const newSocket = io(`http://localhost:8082`);
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    socket?.emit('findAllMessages', { fromUserId: userId, toUserId }, (response: Message[]) => {
      setMessages(response);
    });
  }, [socket, userId, toUserId]);

  useEffect(() => {
    const messageListener = (value: Message) => {
      setMessages((prev) => prev.concat(value));
    };

    socket?.on('message', messageListener);
    return () => {
      socket?.off('message', messageListener);
    };
  }, [socket]);

  return (
    <Box className={styles.chatContainer}>
      <div className={styles.chatContentContainer}>
        <Messages messages={messages} toUserId={toUserId ?? ''} />
        <MessageInput send={send} />
      </div>
    </Box>
  );
};
