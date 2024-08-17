import { AppShell, Button, Container, Group, NavLink, TextInput, Textarea } from '@mantine/core';
import { useState, FormEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createboard, request } from '../../api/boardApi';
import { useIsRobot } from '../../api/captchaApi';
import { PageFrame } from '../../components/Common/PageFrame/PageFrame';


const BoardCreate = () => {
    const [title, setTitle] = useState('');
    const [introduction, setIntroduction] = useState('');
    const { checkIsRobot } = useIsRobot();
    const { channelId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault();
        try {
            const result = await checkIsRobot();
            if (result.score < 0.8) {
                throw new Error('사람이 아님')
            }


            try {
                const newboard: request = {
                    title,
                    introduction,
                };

                await createboard(channelId, newboard);

                navigate(`/channels/${channelId}/admin`);
            } catch (error) {
                alert('Error creating board');
            }

        } catch (error) {
            console.error("Failed to check robot status:", error);
        }


    };


    return (
        <>
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
                            <Group justify='flex-end' >
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
                footerContent={undefined}>

            </PageFrame>
        </>
    );
};

export default BoardCreate;


