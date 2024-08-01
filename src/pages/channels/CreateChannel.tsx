import { Button, Container, Group, TextInput, Textarea, Autocomplete, Loader } from '@mantine/core';
import { useEffect, useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChannel, request, searchGameTitle } from '@/api/channelApi';


const ChannelCreate = () => {
    const [title, setTitle] = useState('');
    const [gameTitle, setGameTitle] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [alias, setAlias] = useState('');
    const [value, setValue] = useState('');
    const [data, setData] = useState<string[]>([]);
    const [gameTitleSearchResult, setGameTitleSearchResult] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef<number | undefined>();

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
    const checkGameTitle = async () => {
        const data = await searchGameTitle(gameTitle);
        const newGameTitleList: [] = JSON.parse(data.body).map((it: SearchGameTitle) => it.name);

        if (newGameTitleList.length === 0) {
            setGameTitleSearchResult(['일치하는 게임 제목이 없습니다.']);
        } else {
            setGameTitleSearchResult(newGameTitleList);
        }
    };


    const handleChange = async (val: string) => {
        setGameTitle(val);
        window.clearTimeout(timeoutRef.current);

        if (val.trim().length === 0) {
            setLoading(false);
            setGameTitleSearchResult([]);
            return;
        }

        setLoading(true);

        timeoutRef.current = window.setTimeout(async () => {
            try {
                const response = await searchGameTitle(val);
                const datas = JSON.parse(response.body);
                const newGameTitleList = datas.map((it: SearchGameTitle) => it.name);

                setGameTitleSearchResult(newGameTitleList);
            } catch (error) {
                console.error('Error fetching game titles:', error);
                setGameTitleSearchResult([]);
            } finally {
                setLoading(false);
            }
        }, 300); // 디바운싱을 위해 300ms 대기
    };

    // 항목 클릭 시 자동완성 목록에서 선택된 값을 입력 필드에 설정
    const handleItemSelect = (item: string) => {
        setGameTitle(item);
        setGameTitleSearchResult([]);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).classList.contains('mantine-autocomplete-item')) {
                setGameTitleSearchResult([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <>
            <Container size={'lg'}>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Autocomplete
                        value={gameTitle}
                        data={gameTitleSearchResult.map(name => ({ value: name, label: name }))}
                        onChange={(val) => handleChange(val)}
                        rightSection={loading ? <Loader size="1rem" /> : null}
                        label="Game Title"
                        placeholder="게임 제목을 입력하세요"
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
        </>
    );
};

export default ChannelCreate;

interface SearchGameTitle {
    id: number;
    name: string;
}

