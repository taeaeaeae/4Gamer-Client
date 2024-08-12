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
    Group 
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
            console.log("Fetched messages:", allMessages); // Debugging line

            if (user?.id) {
                // Filter messages where the targetId matches the user's ID
                const userMessages = allMessages.filter((msg: any) => msg.targetId === user.id);
                console.log("User messages:", userMessages); // Debugging line
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
                        <Card key={msg.id} padding="md" shadow="sm" style={{ marginBottom: '1rem' }}>
                            <Text fw={500}>보낸 사람: {msg.subjectId}</Text>
                            <Text>내용: {msg.message}</Text>
                        </Card>
                    ))
                )}
                <br/>
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
}
