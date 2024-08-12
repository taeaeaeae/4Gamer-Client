import { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { dateFormat } from '../../util/dateUtil';

const Chat = ({ handler }: Chat) => {
  const targetMemberName = '바둑이님과의 채팅'; // TODO: 실제 수신 유저의 닉네임으로 변경
  const subjectId = 'b3a77697-c0f6-4163-94e4-3a985c551989'; // TODO: 실제 발신자 아이디로 변경
  const targetId = '0821b8d9-5141-42a4-8ec6-55d8c034662c'; // TODO: 실제 수신자 아이디로 변경
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
  const roomIdRef = useRef(crypto.randomUUID());

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
        roomId: roomIdRef.current,
      },
      // debug: (msg) => console.log(msg),
      reconnectDelay: 50000,
      onConnect: () => {
        console.log('Connected');

        subscriptionRef.current = stompClient.subscribe(
          `/sub/chat/${roomIdRef.current}`,
          (chat) => {
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
          }
        );
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
        roomId: roomIdRef.current,
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
          roomId: roomIdRef.current,
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
    <div className="chat-container">
      <div className="chat-header">
        <span>{targetMemberName}</span>
        <button type="button" onClick={() => webSocketDisConnection()}></button>
      </div>
      <div className="content">
        {content?.map((value, index) => (
          <div
            className={value.props.children[1].props.className === 'receiver' ? 'right' : 'left'}
            key={index}
          >
            {value}
          </div>
        ))}
      </div>
      <div className="bottom">
        <input type="text" name="message" ref={inputRef} />
        <button
          type="button"
          onClick={(e) => {
            sendMessage(e, inputRef.current!.value);
            inputRef.current!.value = '';
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default Chat;

interface Chat {
  handler: (value: boolean) => void;
}

interface ChatHistory {
  subjectId: string;
  targetId: string;
  message: string;
  createdAt: string;
}
