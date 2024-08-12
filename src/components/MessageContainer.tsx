import classes from '../components/css/Member.module.css';
import { User } from '@/api/types';
import { useNavigate } from 'react-router-dom';
import { 
    Card, 
    Text, 
    Button, 
    Textarea, 
    Input, 
    Paper, 
    Group, 
    Pagination 
} from '@mantine/core';
import { 
    useEffect, 
    useState 
} from 'react';
import { 
    addMessage, 
    getMemberInfo,
    getMessage
} from '../api/member';

export function MessageContainer () {
    const [targetId, setTargetId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(3);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const result = await addMessage(targetId, message);
            setResponse(result);
            setError(null);
            if (user?.id) {
                fetchMessages();
            }
        } catch (err) {
            setError('Failed to add message');
            setResponse(null);
        }
    };

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) return navigate("/main");

        const fetchUserData = async () => {
            try {
                const userInfo = await getMemberInfo(token);
                setUser(userInfo);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };

        fetchUserData();

    }, [token]);

    useEffect(() => {
        if (user?.id) {
            fetchMessages();
        }
    }, [user]);

    const fetchMessages = async () => {
        try {
            const allMessages = await getMessage();
            console.log("Fetched messages:", allMessages);

            if (user?.id) {
                const userMessages = allMessages
                    .filter((msg: any) => msg.targetId === user.id)
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                console.log("Sorted user messages:", userMessages);
                setMessages(userMessages);
            } else {
                setMessages([]);
            }

            setError(null);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            setError('Failed to fetch messages');
        }
    };

    const currentMessages = messages.slice((page - 1) * pageSize, page * pageSize);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
            <Paper shadow="md" radius="lg" style={{ width: 600, maxWidth: '100%', padding: '1rem' }}>
                <Card withBorder padding="xl" radius="md" className={classes.card} style={{ minHeight: '300px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <Input
                                placeholder="Enter Target ID"
                                value={targetId}
                                onChange={(e) => setTargetId(e.target.value)}
                                required
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Textarea 
                                placeholder="Enter your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={6}
                            />
                        </div>
                        <Group justify="right">
                            <Button type="submit">전송</Button>
                        </Group>
                    </form>
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
                </Card>
                <Pagination 
                    total={Math.ceil(messages.length / pageSize)}
                    value={page} 
                    onChange={handlePageChange}
                    style={{ marginTop: '1rem', textAlign: 'center' }}
                />
                <Text fz="lg" fw={700} mt="md">받은 쪽지</Text>
                <br/>
                {currentMessages.length === 0 ? (
                    <Text>쪽지가 존재하지 않습니다.</Text>
                ) : (
                    currentMessages.map((msg) => (
                        <Card key={msg.id} padding="md" shadow="sm" style={{ marginBottom: '1rem' }}>
                            <Text fw={500}> <strong>보낸 사람: </strong> {msg.subjectId}</Text>
                            <Text> <strong>내용: </strong> {msg.message}</Text>
                            <Text fz="sm" color="gray" mt="sm">
                                <strong>보낸 날짜: </strong>
                                {new Date(msg.createdAt).toLocaleDateString()}
                            </Text>
                        </Card>
                    ))
                )}
            </Paper>
        </div>
    );
}
