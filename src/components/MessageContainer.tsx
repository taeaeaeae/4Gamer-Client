import { User } from '@/api/types';
import { useNavigate } from 'react-router-dom';
import './css/message.css'
import { 
    Card, 
    Text, 
    Button, 
    Textarea, 
    Input, 
    Paper, 
    Group, 
    Pagination, 
    Modal 
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
    const [pageSize] = useState(4);
    const [modalOpen, setModalOpen] = useState(false);
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
            setTimeout(() => setModalOpen(false), 1500);
            
        } catch (err) {
            setError('메시지 전송에 실패했습니다.');
            setResponse(null);
        }
    };

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) return navigate("/");

        const fetchUserData = async () => {
            try {
                const userInfo = await getMemberInfo(token);
                setUser(userInfo);
            } catch (error) {
                console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
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
            console.log("가져온 메시지:", allMessages);

            if (user?.id) {
                const userMessages = allMessages
                    .filter((msg: any) => msg.targetId === user.id)
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                console.log("정렬된 사용자 메시지:", userMessages);
                setMessages(userMessages);
            } else {
                setMessages([]);
            }

            setError(null);
        } catch (error) {
            console.error("메시지 가져오기 실패:", error);
            setError('메시지 가져오기 실패');
        }
    };

    const currentMessages = messages.slice((page - 1) * pageSize, page * pageSize);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
            <Paper shadow="md" radius="lg" style={{ width: 600, maxWidth: '100%', padding: '1rem' }}>
                <Modal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="쪽지 입력"
                    size="lg"
                    centered
                >
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <Input
                                placeholder="받는 사람 ID"
                                value={targetId}
                                onChange={(e) => setTargetId(e.target.value)}
                                required
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Textarea 
                                placeholder="메시지를 입력하세요"
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
                            성공적으로 메시지가 전송되었습니다.
                        </Text>
                    )}
                    {error && (
                        <Text mt="md" color="red">
                            {error}
                        </Text>
                    )}
                </Modal>
                <Text fz="lg" fw={700} mt="md">받은 쪽지</Text>
                <br/>
                {currentMessages.length === 0 ? (
                    <Text>쪽지가 존재하지 않습니다.</Text>
                ) : (
                    currentMessages.map((msg) => (
                        <Card key={msg.id} padding="md" shadow="sm" style={{ marginBottom: '1rem' }}>
                           <Text fw={500}> <strong>From: </strong> {msg.subjectId}</Text>
                           <br/>
                           <Text className="message-text">{msg.message}</Text>
                           <Text fz="sm" color="gray" mt="sm" style={{ marginLeft: 'auto' }}>
                                <strong>보낸 날짜: </strong>
                                 {new Date(msg.createdAt).toLocaleString()}
                              </Text>
                           </Card>
                    ))
                )}
                <Pagination 
                    total={Math.ceil(messages.length / pageSize)}
                    value={page} 
                    onChange={handlePageChange}
                    style={{ marginTop: '1rem', textAlign: 'center' }}
                />
                <br/>
                <Group justify="right">
                <Button onClick={() => setModalOpen(true)}>쪽지 보내기</Button>
                </Group>
            </Paper>
        </div>
    );
}
