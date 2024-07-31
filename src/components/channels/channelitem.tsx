import { Card, Text, Badge, Button, Group, Grid, Container } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getChannels } from '../../api/channelApi';

function ChannelItem(item: Channel) { //(item: Channel) {

    const navigate = useNavigate();

    const handleDetailClick = () => {
        navigate(`/channels/${item.id}`);
    };

    return (
        <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{item.gameTitle}</Text>
                <Badge color="pink">{item.alias}</Badge>
            </Group>
            <Text size="sm" c="dimmed">
                {item.introduction}
            </Text>
            <Button color="blue" fullWidth mt="md" radius="md" onClick={handleDetailClick}>
                {item.title}
            </Button>
        </Card>
    );
}

const ChannelList = ({ fetchChannels }: ChannelListProps) => {
    const [channelList, setChannelList] = useState<Channel[]>([]);
    const ref = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    const handleCreateClick = () => {
        navigate(`/channels/new`);
    };

    const fetchChannelList = async () => {
        const data = await getChannels();
        setChannelList(data.content);
    };

    useEffect(() => {
        fetchChannelList();
    }, []); // 빈 배열을 의존성 배열로 전달하여 컴포넌트가 마운트될 때만 실행되도록 함
    const demoProps = {
        bg: 'var(--mantine-color-blue-light)',
        h: 50,
        mt: 'md',
    };

    return (
        <>
            <Container {...demoProps}>
                <Text>asdf?</Text>
                <Button onClick={handleCreateClick} >CREATE</Button>
                <hr />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {channelList.map((value: Channel) => (
                        <Grid key={value.id}>
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
        </>
    );
};

export default ChannelList;

export interface Channel {
    id: number;
    title: String;
    gameTitle: String;
    introduction: String;
    alias: String;
    createdAt: string;
    updatedAt: string;
}

interface ChannelListProps {
    channels: Channel[];
    // removeChannel: (id: number) => Promise<void>;
    fetchChannels: () => Promise<void>;
}

