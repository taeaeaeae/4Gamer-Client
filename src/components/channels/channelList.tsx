import { Button, Card, Group, Text } from "@mantine/core";
import { Channel } from "./channelitem";


const ChannelList = ({ Channels, removeChannel, toggleChannel, getChannelDetail }) => {
    return (
        <div className="Channel-list">
            <ul>
                {Channels.map((Channel: Channel) => (
                    <Card key={Channel.id} shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mt="md" mb="xs">
                            <Text fw={500}>
                                {Channel.id} : {Channel.title}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {Channel.completed ? "완료" : "미완료"}
                            </Text>
                        </Group>

                        <Button.Group>
                            <Button variant="light" onClick={() => getChannelDetail(Channel.id)}>
                                상세보기
                            </Button>
                            <Button
                                variant="filled"
                                onClick={() =>
                                    toggleChannel({
                                        ...Channel,
                                        completed: !Channel.completed,
                                    })
                                }
                            >
                                완료
                            </Button>
                            <Button
                                variant="outline"
                                color="red"
                                onClick={() => removeChannel(Channel.id)}
                            >
                                삭제
                            </Button>
                        </Button.Group>
                    </Card>
                ))}
            </ul>
        </div>
    );
};

export default ChannelList;