import { Card, Text, Badge, Button, Group, Container, Space, Flex, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getChannels } from '../../api/channelApi';
import { useIsRobot } from '../../api/captchaApi';
import { PageFrame } from '../Common/PageFrame/PageFrame';
import { getMemberInfo } from '../../api/member';

function ChannelItem({ item, memberId }: { item: Channel; memberId: string }) {
    const navigate = useNavigate();

    const handleDetailClick = () => {
        navigate(`/channels/${item.id}`);
    };

    const handleAdminClick = () => {
        navigate(`/channels/${item.id}/admin`);
    };

    return (
        <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder w={280} h={300} m={10}>
            <Group justify="space-between" mt="md" mb="xs" h={70}>
                <Text fw={500}>{item.gameTitle}</Text>
                <Badge color="pink">{item.alias}</Badge>
            </Group>
            <Text size="sm" c="dimmed" h={120}>
                {item.introduction}
            </Text>
            {item.admin === memberId &&
                <Button color="green" h={30} fullWidth mt="md" radius="md" onClick={handleAdminClick}>내 채널 관리</Button>
            }
            <Button color="blue" h={30} fullWidth mt="md" radius="md" onClick={handleDetailClick}>
                {item.title}
            </Button>
        </Card>
    );
}

const ChannelList = ({ fetchChannels }: ChannelListProps) => {
    const [channelList, setChannelList] = useState<Channel[]>([]);
    const [memberId, setMemberId] = useState<string>('');
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement | null>(null);
    const { checkIsRobot } = useIsRobot();
    const navigate = useNavigate();

    const handleCreateClick = async () => {
        try {
            const result = await checkIsRobot();
            if (result.score < 0.8) {
                throw new Error('사람이 아님');
            }
            navigate("/channels/new");
        } catch (error) {
            console.error("Failed to check robot status:", error);
        }
    };

    const accessToken = localStorage.getItem("accessToken");

    const fetchChannelList = async () => {
        const data = await getChannels();
        setChannelList(data.content);
        if (accessToken) {
            const member = await getMemberInfo(accessToken);
            setMemberId(member.id);
        }
    };

    useEffect(() => {
        fetchChannelList();
    }, []);

    const filteredChannelList = channelList.filter((channel) =>
        channel.title.toLowerCase().includes(search.toLowerCase()) ||
        channel.gameTitle.toLowerCase().includes(search.toLowerCase()) ||
        channel.alias.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PageFrame
            bodyContent={
                <Container fluid bg="var(--mantine-color-blue-light)">
                    <Group justify="space-between" m={10}>
                        <Text>채널 목록</Text>
                        {accessToken &&
                            <Button onClick={handleCreateClick}>CREATE</Button>
                        }
                    </Group>
                    <TextInput
                        placeholder="찾고 싶은 채널을 입력하세요"
                        mb="md"
                        value={search}
                        onChange={(event) => setSearch(event.currentTarget.value)}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                        {filteredChannelList.map((value) => (
                            <ChannelItem
                                key={value.id}
                                item={value}
                                memberId={memberId}
                            />
                        ))}
                        <div ref={ref}></div>
                    </div>
                </Container>
            }
            navbarContent={undefined}
            asideContent={undefined}
            headerContent={undefined}
            footerContent={undefined}
        />
    );
};

export default ChannelList;

export interface Channel {
    id: number;
    title: string;
    gameTitle: string;
    introduction: string;
    admin: string;
    alias: string;
    createdAt: string;
    updatedAt: string;
}

interface ChannelListProps {
    fetchChannels: () => Promise<void>;
}