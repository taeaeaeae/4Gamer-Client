import { useEffect, useRef } from 'react';
import { getMemberInfo } from '../../api/member';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebsocketConnection = () => {
  const clientRef = useRef<Client>();
  const tokenRef = useRef(localStorage.getItem('accessToken') || '');
  const subscriptionRef = useRef<StompSubscription>();
  const subjectId = useRef<string>();

  const webSocketConnection = (userId: string) => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WEBSOCKET_BASE_URL),
      connectHeaders: {
        token: tokenRef.current,
      },
      debug: (msg) => console.log(msg),
      reconnectDelay: 500000,
      onConnect: () => {
        console.log('Connected');

        subscriptionRef.current = stompClient.subscribe(
          `/sub/notification/${userId}`,
          (notification) => {
            console.log('notification: ', notification.body);
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

  return <></>;
};

export default WebsocketConnection;
