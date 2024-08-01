import { Button, Container, Group, TextInput, Textarea } from '@mantine/core';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChannel, request } from '@/api/channelApi';

const ChannelCreate = () => {
    const [title, setTitle] = useState('');
    const [gameTitle, setGameTitle] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [alias, setAlias] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            // API를 통해 데이터를 포스트
            const newChannel: request = {
                title,
                gameTitle,
                introduction,
                alias,
            };

            await createChannel(newChannel);

            // 성공적으로 포스트된 후 채널 목록 화면으로 이동
            navigate('/channels');
        } catch (error) {
            // 에러 처리
            alert('Error creating channel');
        }
    };

    return (
        <Container size={'lg'}>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextInput
                    label="Game Title"
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                />
                <Textarea
                    label="Introduction"
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                />
                <TextInput
                    label="Alias"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                />
                <br />
                <Group justify='flex-end' >
                    <Button mr={30} type="submit">Submit</Button>
                </Group>
            </form>

        </Container>
    );
};

export default ChannelCreate;
