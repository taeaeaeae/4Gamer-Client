import { useEffect, useRef, useState } from 'react';
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { getChannels } from '../../api/channelApi';

const ChannelList = () => {
    const [channelList, setChannelList] = useState<ChannelList[]>([]);
    const ref = useRef<HTMLDivElement | null>(null);

    const fetchChannelList = async () => {
        const data = await getChannels();
        setChannelList(data.content);
    };

    useEffect(() => {
        fetchChannelList();
    }, []);

    return (
        channelList.map((feature) => (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                    <Image
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                        height={160}
                        alt="Norway"
                    />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>{feature.title}</Text>
                    <Badge color="pink"></Badge>
                </Group>

                <Text size="sm" c="dimmed">
                    {feature.introduction}
                </Text>

                <Button color="blue" fullWidth mt="md" radius="md">
                    {feature.gameTitle}
                </Button>
            </Card>
        )
        )
    );
}

export default ChannelList;



interface ChannelList {
    id: number;
    title: string;
    gameTitle: string;
    introduction: string;
    alias: string;
    createdAt: string;
    updatedAt: string;
}