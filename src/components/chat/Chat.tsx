import {
  Button,
  Card,
  Group,
  Input,
  Paper,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import './Chat.css';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { dateFormat } from '../../util/dateUtil';

const Chat = ({ subjectId, targetId, roomId, handler }: Chat) => {
  const targetMemberName = `${targetId}님과의 채팅`;
  const token = localStorage.getItem('accessToken') || '';
  const [client, setClient] = useState<Client | null>(null);
  const senderTemplate = (message: string, createdAt: string) => (
    <>
      <span className="sender">{message}</span>
      <span>{dateFormat(createdAt).slice(-5)}</span>
    </>
  );
  const receiverTemplate = (message: string, createdAt: string) => (
    <>
      <span>{dateFormat(createdAt).slice(-5)}</span>
      <span className="receiver">{message}</span>
    </>
  );
  const [prevChatHistory, setPrevChatHistory] = useState<ChatHistory[]>(() =>
    JSON.parse(localStorage.getItem(targetId) || '[]')
  );
  const [content, setContent] = useState<JSX.Element[]>(
    prevChatHistory.map((value) =>
      value.subjectId === subjectId
        ? receiverTemplate(value.message, value.createdAt)
        : senderTemplate(value.message, value.createdAt)
    )
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const subscriptionRef = useRef<StompSubscription>();

  const addChatHistory = (
    subjectId: string,
    targetId: string,
    message: string,
    createdAt: string
  ) => {
    setPrevChatHistory((prev) => [
      ...prev,
      {
        subjectId,
        targetId,
        message,
        createdAt,
      },
    ]);
  };

  const webSocketConnection = () => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WEBSOCKET_BASE_URL),
      connectHeaders: {
        token,
        targetId,
        roomId,
      },
      // debug: (msg) => console.log(msg),
      reconnectDelay: 50000,
      onConnect: () => {
        console.log('Connected');

        subscriptionRef.current = stompClient.subscribe(`/sub/chat/${roomId}`, (chat) => {
          console.log('chat: ', chat);
          const response = JSON.parse(chat.body);

          addChatHistory(
            response.subjectId,
            response.targetId,
            response.message,
            response.createdAt
          );

          if (response.subjectId !== subjectId) {
            setContent((prev) => [...prev, senderTemplate(response.message, response.createdAt)]);
          }
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);
  };

  const webSocketDisConnection = () => {
    localStorage.setItem(targetId, JSON.stringify(prevChatHistory));

    client?.publish({
      destination: '/pub/chat',
      body: JSON.stringify({
        type: 'EXIT',
        roomId,
        subjectId,
        targetId,
        message: `${subjectId}님이 채팅을 종료했습니다.`,
        createdAt: new Date(),
      }),
    });

    subscriptionRef.current?.unsubscribe();
    client?.deactivate();
    handler(false);
  };

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, message: string) => {
    e.preventDefault();

    if (message) {
      setContent([...content, receiverTemplate(message, dateFormat(new Date().toISOString()))]);

      client?.publish({
        destination: '/pub/chat',
        body: JSON.stringify({
          type: 'CHAT',
          roomId,
          subjectId,
          targetId,
          message,
          createdAt: new Date(),
        }),
      });
    }
  };

  useEffect(() => {
    webSocketConnection();
  }, []);

  return (
    <Card w={500} bd="1px solid" shadow="xl">
      <Group justify="space-between">
        <span>{targetMemberName}</span>
        <IconX stroke={2} onClick={() => webSocketDisConnection()} />
      </Group>
      <ScrollArea h={500} pt={20} pr={20} pb={20} scrollbars="y">
        {prevChatHistory.map((value, index) =>
          value.subjectId === subjectId ? (
            <Group key={index} justify="flex-end" mt={10} mb={10}>
              <Text ms={20}>{dateFormat(value.createdAt).slice(-5)}</Text>
              <Textarea autosize>{value.message}</Textarea>
            </Group>
          ) : (
            <Group key={index} justify="flex-start" mt={10} mb={10}>
              <Textarea autosize>{value.message}</Textarea>
              <Text>{dateFormat(value.createdAt).slice(-5)}</Text>
            </Group>
          )
        )}
      </ScrollArea>
      <Group justify="space-between">
        <TextInput ref={inputRef} w={380} />
        <Button
          type="button"
          onClick={(e) => {
            sendMessage(e, inputRef.current!.value);
            inputRef.current!.value = '';
          }}
        >
          전송
        </Button>
      </Group>
    </Card>
  );
};

export default Chat;

interface Chat {
  subjectId: string;
  targetId: string;
  roomId: string;
  handler: (value: boolean) => void;
}

interface ChatHistory {
  subjectId: string;
  targetId: string;
  message: string;
  createdAt: string;
}
