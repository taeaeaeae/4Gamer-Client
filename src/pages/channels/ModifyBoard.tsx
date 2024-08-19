import { AppShell, Button, Container, Group, NavLink, TextInput, Textarea, Autocomplete, Loader } from '@mantine/core';
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBoard, updateBoards } from '../../api/boardApi';
import { useIsRobot } from '../../api/captchaApi';
import { PageFrame } from '../../components/Common/PageFrame/PageFrame';

const ModifyBoard = () => {
    const [title, setTitle] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { checkIsRobot } = useIsRobot();
    const navigate = useNavigate();
    const { channelId } = useParams<{ channelId: string }>();
    const { boardId } = useParams<{ boardId: string }>();

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                setIsLoading(true);
                const board = await getBoard(channelId, boardId);
                setTitle(board.title);
                setIntroduction(board.introduction);
            } catch (error) {
                console.error('Error fetching board data:', error);
                alert('Failed to load board data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchChannelData();
    }, [boardId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (introduction.length < 10) {
                alert('Introduction을 10글자 이상 입력하세요.');
                throw new Error('설명을 10글자 이상 작성해야합니다');
            }
            const result = await checkIsRobot();
            if (result.score < 0.8) {
                throw new Error('사람이 아님');
            }

            try {
                const updateBoard = { title, introduction };
                await updateBoards(channelId, boardId, updateBoard);
                navigate(`/channels/${channelId}/admin`);
            } catch (error) {
                alert(`Error updating board:${error}`);
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
                        <Textarea
                            label="Introduction"
                            value={introduction}
                            onChange={(e) => setIntroduction(e.target.value)}
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

export default ModifyBoard;
