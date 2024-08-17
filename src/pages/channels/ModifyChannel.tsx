import { AppShell, Button, Container, Group, NavLink, TextInput, Textarea, Autocomplete, Loader } from '@mantine/core';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getChannelItem, updateChannel } from '../../api/channelApi';
import { useIsRobot } from '../../api/captchaApi';
import { PageFrame } from '../../components/Common/PageFrame/PageFrame';

const ModifyChannel = () => {
    const [title, setTitle] = useState('');
    const [gameTitle, setGameTitle] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [alias, setAlias] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { checkIsRobot } = useIsRobot();
    const navigate = useNavigate();
    const { channelId } = useParams<{ channelId: string }>();

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                setIsLoading(true);
                const channel = await getChannelItem(channelId);
                setTitle(channel.title);
                setGameTitle(channel.gameTitle);
                setIntroduction(channel.introduction);
                setAlias(channel.alias);
            } catch (error) {
                console.error('Error fetching channel data:', error);
                alert('Failed to load channel data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchChannelData();
    }, [channelId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const result = await checkIsRobot();
            if (result.score < 0.8) {
                throw new Error('사람이 아님');
            }

            try {
                const updatedChannel = { title, introduction };
                await updateChannel(channelId, updatedChannel);
                navigate(`/channels/${channelId}/admin`);
            } catch (error) {
                alert('Error updating channel');
            }
        } catch (error) {
            console.error('Failed to check robot status:', error);
        }
    };


    if (isLoading) {
        return <Loader />;
    }

    return (<>
        <PageFrame
            bodyContent={
                <Container size={'lg'}>
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextInput
                            value={gameTitle}
                            label="Game Title"
                            readOnly
                        />
                        <Textarea
                            label="Introduction"
                            value={introduction}
                            onChange={(e) => setIntroduction(e.target.value)}
                        />
                        <TextInput
                            label="Alias"
                            value={alias}
                            readOnly
                        />
                        <br />
                        <Group justify='flex-end'>
                            <Button mr={30} type="submit">Submit</Button>
                        </Group>
                    </form>
                </Container>
            }
            navbarContent={
                <>
                  <AppShell.Section>
                    <NavLink component="a" href="/game-reviews" label="게임 리뷰 페이지" />
                  </AppShell.Section>
                </>
              }
            asideContent={undefined}
            headerContent={undefined}
            footerContent={undefined}
        />
    </>
    );
};

export default ModifyChannel;

interface SearchGameTitle {
    id: number;
    name: string;
}
