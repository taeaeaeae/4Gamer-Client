import { useEffect, useRef } from 'react';
import { getMemberInfo } from '../../api/member';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebsocketConnection = () => {
  const clientRef = useRef<Client>();

  const tokenRef = useRef(localStorage.getItem('accessToken') || '');

  const webSocketConnection = (userId: string) => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        token: tokenRef.current,
      },
      // debug: (msg) => console.log(msg),
      reconnectDelay: 500000,
      onConnect: () => {
        console.log('Connected');

        stompClient.subscribe(`/sub/notification/${userId}`, (notification) => {
          console.log('notification: ', notification.body);
        });
      },
    });

    stompClient.activate();

    clientRef.current = stompClient;
  };

  const initialize = async () => {
    const userInfo = await getMemberInfo(tokenRef.current);
    webSocketConnection(userInfo.id);
  };

  useEffect(() => {
    if (tokenRef.current) {
      initialize();
    }
  }, [tokenRef]);

  return <></>;
};

export default WebsocketConnection;
