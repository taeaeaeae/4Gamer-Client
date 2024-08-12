import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBell, IconBellFilled } from '@tabler/icons-react';
import { Box, Card, Divider, Indicator, Notification, Paper, Text } from '@mantine/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getMemberInfo } from '../../api/member';
import Chat from '../chat/Chat';

const WebsocketConnection = () => {
  const clientRef = useRef<Client>();
  const tokenRef = useRef(localStorage.getItem('accessToken') || '');
  const subscriptionRef = useRef<StompSubscription>();
  const subjectId = useRef<string>();
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const [openChatWindow, setOpenChatWindow] = useState(false);

  const handleChatWindow = (value: boolean) => {
    setOpenChatWindow(value);
  };

  const webSocketConnection = (userId: string) => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WEBSOCKET_BASE_URL),
      connectHeaders: {
        token: tokenRef.current,
      },
      // debug: (msg) => console.log(msg),
      reconnectDelay: 50000,
      onConnect: () => {
        console.log('Connected');

        subscriptionRef.current = stompClient.subscribe(
          `/sub/notification/${userId}`,
          (response) => {
            console.log('notification: ', response.body);
            const notification = JSON.parse(response.body);
            setNotificationList((prev) => [...prev, notification]);
          }
        );
      },
    });

    stompClient.activate();

    clientRef.current = stompClient;
  };

  const initialize = async () => {
    const userInfo = await getMemberInfo(tokenRef.current);
    webSocketConnection(userInfo.id);
    subjectId.current = userInfo.id;
  };

  const webSocketDisConnection = () => {
    clientRef.current?.publish({
      destination: '/pub/notification',
      body: JSON.stringify({
        type: 'EXIT',
        subjectId: subjectId.current,
        targetId: subjectId.current,
        message: `${subjectId}님이 로그아웃 또는 브라우저를 종료했습니다.`,
        createdAt: new Date(),
      }),
    });

    subscriptionRef.current?.unsubscribe();
    clientRef.current?.deactivate();
  };

  useEffect(() => {
    if (tokenRef.current) {
      initialize();
    }

    window.addEventListener('beforeunload', webSocketDisConnection);

    return () => {
      window.removeEventListener('beforeunload', webSocketDisConnection);
    };
  }, [tokenRef]);

  useEffect(() => {}, [notificationList]);

  return (
    <Box pos="relative">
      {(tokenRef.current && notificationList.length !== 0 && (
        <Indicator inline processing color="red" size={10} onClick={() => setIsClicked(true)}>
          <IconBellFilled />
        </Indicator>
      )) || <IconBell />}
      {isClicked && (
        <Paper pos="absolute" right={0} w={380} bg="white" bd="1px solid dark.9">
          {notificationList.map((value, index) => (
            <Card
              key={index}
              onClick={() => {
                value.type === 'NOTIFICATION' ? navigate('/message') : <Chat handler={handleChatWindow} />;
              }}
            >
              {index !== 0 && <Divider my="md" mt={0} mb={30} />}
              <Text>{value.targetId}님께서 메시지를 보냈습니다.</Text>
              <br />
              <Text>{value.message}</Text>
            </Card>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default WebsocketConnection;

interface Notification {
  type: string;
  subjectId: string;
  targetId: string;
  roomId: string;
  message: string;
  createdAt: string;
}
