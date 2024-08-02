import { Button, Container, Group, TextInput, Textarea, Autocomplete, Loader } from '@mantine/core';
import { useState, FormEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createboard, request } from '@/api/boardApi';
import { useIsRobot } from '@/api/captchaApi';


const BoardCreate = () => {
    const [title, setTitle] = useState('');
    const [introduction, setIntroduction] = useState('');
    const { checkIsRobot } = useIsRobot();
    const { channelId } = useParams();
    const navigate = useNavigate();

    // 검증됐을 때 할 행동
    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault();
        try {
            // 로봇여부체크
            const result = await checkIsRobot();
            if (result.score < 0.8) {
                throw new Error('사람이 아님')
            }


            try {
                // API를 통해 데이터를 포스트
                const newboard: request = {
                    title,
                    introduction,
                };

                await createboard(channelId, newboard);

                // 성공적으로 포스트된 후 채널 목록 화면으로 이동
                navigate(`/channels/${channelId}/admin`);
            } catch (error) {
                // 에러 처리
                alert('Error creating board');
            }

        } catch (error) {
            console.error("Failed to check robot status:", error);
        }


    };


    return (
        <>
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
        </>
    );
};

export default BoardCreate;


