import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function ChannelItem(item: Channel) {

    const navigate = useNavigate();

    const handleDetailClick = () => {
        navigate(`/channels/${item.id}`);
    };

    return (
        <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                    height={160}
                    alt="Norway"
                />
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


function ChannelItems(item: Channel) {
    return (
        <>
            <div className="game-review-container">
                <div>
                    <img
                        alt={`${item.gameTitle} 이미지`}
                    />
                </div>
                <div>
                    <h2 className="game-title">{item.gameTitle}</h2>
                    <div className="align-right">
                    </div>
                    <p>{(item.createdAt)}</p>
                    <p className="description">{item.introduction}</p>
                </div>
            </div>
        </>
    );
}




export default ChannelItem;

export interface Channel {
    id: number;
    title: String;
    gameTitle: String;
    introduction: String;
    alias: String;
    createdAt: string;
    updatedAt: string;
}
