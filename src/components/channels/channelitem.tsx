import { Card, Text, Badge, Button, Group, Grid, Container, Space, Flex, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getChannels } from '../../api/channelApi';
import { useIsRobot } from '../../api/captchaApi';
import { IconSearch } from '@tabler/icons-react';
import { PageFrame } from '../Common/PageFrame/PageFrame';

function ChannelItem(item: Channel) {
    const navigate = useNavigate();

    const handleDetailClick = () => {
        navigate(`/channels/${item.id}`);
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
            <Button color="blue" h={30} fullWidth mt="md" radius="md" onClick={handleDetailClick}>
                {item.title}
            </Button>
        </Card>
    );
}

const ChannelList = ({ fetchChannels }: ChannelListProps) => {
    const [channelList, setChannelList] = useState<Channel[]>([]);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement | null>(null);
    const { checkIsRobot } = useIsRobot();
    const navigate = useNavigate();

    const handleCreateClick = async () => {
        try {
            // 로봇 여부 체크
            const result = await checkIsRobot();
            if (result.score < 0.8) {
                throw new Error('사람이 아님');
            }
            // 검증됐을 때 할 행동
            navigate("/channels/new")
        } catch (error) {
            console.error("Failed to check robot status:", error);
        }
    };

    const fetchChannelList = async () => {
        const data = await getChannels();
        setChannelList(data.content);
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
        <>
            <PageFrame
                bodyContent={

                    <Container fluid bg="var(--mantine-color-blue-light)">
                        <Group justify='space-between' m={10}>
                            <Text>채널목록</Text>
                            <Button onClick={handleCreateClick}>CREATE</Button>
                        </Group>
                        <TextInput
                            placeholder="찾고싶은 채널을 입력하세요"
                            mb="md"
                            value={search}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                            {filteredChannelList.map((value) => (
                                <Grid key={value.id} display={Flex}>
                                    <ChannelItem
                                        id={value.id}
                                        title={value.title}
                                        gameTitle={value.gameTitle}
                                        introduction={value.introduction}
                                        alias={value.alias}
                                        createdAt={value.createdAt}
                                        updatedAt={value.updatedAt}
                                    />
                                </Grid>
                            ))}
                            <div ref={ref}></div>
                        </div>
                    </Container>
                }
                navbarContent={undefined}
                asideContent={undefined}
                headerContent={undefined}
                footerContent={undefined}>


            </PageFrame>
        </>
    );
};

export default ChannelList;

export interface Channel {
    id: number;
    title: string;
    gameTitle: string;
    introduction: string;
    alias: string;
    createdAt: string;
    updatedAt: string;
}

interface ChannelListProps {
    channels: Channel[];
    removeChannel: (id: number) => Promise<void>;
    fetchChannels: () => Promise<void>;
}
