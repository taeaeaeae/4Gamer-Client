import { Button, Card, Group, ScrollArea, Text, Textarea, TextInput } from '@mantine/core';
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
  const viewport = useRef<HTMLDivElement>(null);
  const [isTargetExited, setIsTargetExited] = useState(false);

  const scrollToBottom = () =>
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'smooth' });

  const [prevChatHistory, setPrevChatHistory] = useState<ChatHistory[]>(() =>
    JSON.parse(localStorage.getItem(targetId) || '[]')
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
          try {
            const response = JSON.parse(chat.body);

            if (response.subjectId !== subjectId) {
              addChatHistory(
                response.subjectId,
                response.targetId,
                response.message,
                response.createdAt
              );
            }
          } catch (e) {
            // console.log(chat.body);
            setIsTargetExited(true);
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
      addChatHistory(subjectId, targetId, message, dateFormat(new Date().toISOString()));

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

  useEffect(() => {
    scrollToBottom();
  }, [prevChatHistory, isTargetExited]);

  return (
    <Card w={500} bd="1px solid" shadow="xl">
      <Group justify="space-between">
        <span>{targetMemberName}</span>
        <IconX stroke={2} onClick={() => webSocketDisConnection()} />
      </Group>
      <ScrollArea h={500} mt={20} pr={20} mb={20} scrollbars="y" viewportRef={viewport}>
        {prevChatHistory.map((value, index) =>
          value.subjectId === subjectId ? (
            <Group key={index} align="end" justify="flex-end" mt={10} mb={10}>
              <Text size="xs" ms={20}>
                {dateFormat(value.createdAt).slice(-5)}
              </Text>
              <Textarea readOnly autosize defaultValue={value.message} />
            </Group>
          ) : (
            <Group key={index} align="end" justify="flex-start" mt={10} mb={10}>
              <Textarea readOnly autosize defaultValue={value.message} />
              <Text size="xs">{dateFormat(value.createdAt).slice(-5)}</Text>
            </Group>
          )
        )}
        {isTargetExited && `${targetId}님께서 채팅을 종료했습니다.`}
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
