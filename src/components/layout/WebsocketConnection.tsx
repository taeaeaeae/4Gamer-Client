import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBell, IconBellFilled } from '@tabler/icons-react';
import {
  Box,
  Card,
  Divider,
  Indicator,
  Notification,
  Popover,
  ScrollArea,
  Text,
} from '@mantine/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getMemberInfo } from '../../api/member';
import Chat from '../chat/Chat';

const WebsocketConnection = () => {
  const clientRef = useRef<Client>();
  const tokenRef = useRef(localStorage.getItem('accessToken') || '');
  const subscriptionRef = useRef<StompSubscription>();
  const subjectId = useRef<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [notificationList, setNotificationList] = useState<Notification[]>(
    JSON.parse(localStorage.getItem('notificationList') || '[]')
  );
  const [openChatWindow, setOpenChatWindow] = useState(false);
  const navigate = useNavigate();

  const handleChatWindow = (value: boolean) => {
    setOpenChatWindow(value);
  };

  const notificationListLocalSave = () => {
    localStorage.setItem('notificationList', JSON.stringify(notificationList));
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
        // console.log('Connected');

        subscriptionRef.current = stompClient.subscribe(
          `/sub/notification/${userId}`,
          (response) => {
            const notification = JSON.parse(response.body);

            setNotificationList((prev) => [...prev, notification]);

            if (notification.roomId) {
              setTargetId(notification.subjectId);
              setRoomId(notification.roomId);
            }
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

  useEffect(() => {
    notificationListLocalSave();
  }, [notificationList]);

  useEffect(() => {
    if (openChatWindow) {
      clientRef.current?.publish({
        destination: '/pub/chat',
        body: JSON.stringify({
          type: 'ENTER',
          roomId,
          subjectId: subjectId.current,
          targetId: subjectId.current,
          message: `${subjectId}님께서 입장하셨습니다.`,
          createdAt: new Date(),
        }),
      });
    }
  }, [openChatWindow]);

  return (
    <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
      <Box pos="relative">
        {(tokenRef.current && notificationList.length !== 0 && (
          <Indicator inline processing color="red" size={10}>
            <Popover.Target>
              <IconBellFilled />
            </Popover.Target>
          </Indicator>
        )) || (
          <Popover.Target>
            <IconBell />
          </Popover.Target>
        )}
        <Popover.Dropdown>
          <ScrollArea h={300}>
            {notificationList.length === 0 ? (
              <Text mt={50} ml={50}>
                새로운 알림이 없습니다.
              </Text>
            ) : (
              notificationList.map((value, index) => (
                <Card
                  key={index}
                  onClick={() => {
                    const newNotificationList = notificationList.filter((_, i) => i !== index);
                    setNotificationList(newNotificationList);
                    value.roomId ? setOpenChatWindow(true) : navigate('/message');
                  }}
                >
                  {index !== 0 && <Divider my="md" mt={0} mb={30} />}
                  {value.roomId === null && <Text>{value.subjectId}님이 쪽지를 보냈습니다.</Text>}
                  <br />
                  <Text>{value.message}</Text>
                </Card>
              ))
            )}
          </ScrollArea>
        </Popover.Dropdown>
      </Box>
      <Box pos="absolute" top={100} right={100}>
        {openChatWindow && (
          <Chat
            subjectId={subjectId.current}
            targetId={targetId}
            roomId={roomId}
            handler={handleChatWindow}
          />
        )}
      </Box>
    </Popover>
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
