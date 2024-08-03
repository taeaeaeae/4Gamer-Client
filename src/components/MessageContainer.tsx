import classes from '../components/css/Member.module.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { User } from '@/api/types';
import { useNavigate } from 'react-router-dom';
import { 
    Card, 
    Text, 
    Button, 
    Textarea, 
    Input, 
    Paper, 
    Group } from '@mantine/core';
import { 
    useEffect, 
    useState } from 'react';
import { 
    addMessage, 
    getMemberInfo } from '../api/member';

export function MessageContainer () {
    const [targetId, setTargetId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<any[]>([]); // 새로운 상태 추가
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const result = await addMessage(targetId, message);
            setResponse(result);
            setError(null);
        } catch (err) {
            setError('Failed to add message');
            setResponse(null);
        }
    };

    const preventClose = (e: { preventDefault: () => void }) => {
        e.preventDefault();
    };

    const token = localStorage.getItem("accessToken");

    const webSocketConnection = (userId: string) => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                token: localStorage.getItem("accessToken") || "", 
            },
            debug: (msg) => console.log(msg),
            reconnectDelay: 500000,
            onConnect: () => {
                console.log("Connected");
                stompClient.subscribe(
                    `/sub/notification/${userId}`,
                    (notification) => {
                        const parsedMessage = JSON.parse(notification.body);
                        const newMessage = {
                            subjectId: parsedMessage.subjectId,
                            targetId: parsedMessage.targetId,
                            message: JSON.parse(parsedMessage.message).message,
                        };
                        setMessages((prevMessages) => [...prevMessages, newMessage]);
                    }
                );
            },
        });
        stompClient.activate();
        setClient(stompClient);
        window.addEventListener("beforeunload", preventClose);
    };

    useEffect(() => {
        if (!token) return navigate("/main");
        const initialize = async () => {
            const userInfo = await getMemberInfo(token);
            webSocketConnection(userInfo.id);
            navigate("/message");
        };
        initialize();
        
        const getUser = async () => {
            try {
                const data: User = await getMemberInfo(token);
                console.log("data :>> ", data);
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        getUser();
    }, [token]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
            <Paper shadow="md" radius="lg" style={{ width: 600, maxWidth: '100%', padding: '1rem' }}>
            <Text fz="lg" fw={700} mt="md">
                    받은 쪽지
                </Text>
                <br/>
                {messages.length === 0 ? (
                    <Text>아직 쪽지가 없습니다.</Text>
                ) : (
                    messages.map((msg) => (
                        <Card key={msg.subjectId} padding="md" shadow="sm" style={{ marginBottom: '1rem' }}>
                            <Text fw={500}>보낸 사람: {msg.targetId}</Text>
                            <Text>내용: {msg.message}</Text>
                        </Card>
                    ))
                )}
                <br/>
                <Card withBorder padding="xl" radius="md" className={classes.card}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <Input
                                placeholder="Enter Target ID"
                                value={targetId}
                                onChange={(e) => setTargetId(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Textarea 
                                placeholder="Enter your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                        <Group justify="right">
                            <Button type="submit">전송</Button>
                        </Group>
                    </form>
                </Card>
                {response && (
                    <Text mt="md" color="green">
                        성공적으로 메세지가 전송되었습니다.
                    </Text>
                )}
                {error && (
                    <Text mt="md" color="red">
                        {error}
                    </Text>
                )}
            </Paper>
        </div>
    );
};
