import { AppShell, Button, Container, Group, NavLink, TextInput, Textarea, Autocomplete, Loader } from '@mantine/core';
import { useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChannel, request, searchGameTitle } from '../../api/channelApi';
import { useIsRobot } from '../../api/captchaApi';
import { PageFrame } from '../../components/Common/PageFrame/PageFrame';

const ChannelCreate = () => {
  const [title, setTitle] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [alias, setAlias] = useState('');
  const [gameTitleSearchResult, setGameTitleSearchResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | undefined>();

  const { checkIsRobot } = useIsRobot();
  const navigate = useNavigate();

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
        const newChannel: request = {
          title,
          gameTitle,
          introduction,
          alias,
        };

        await createChannel(newChannel);

        navigate('/channels');
      } catch (error) {
        // 에러 처리
        alert('이미 존재하는 채널인지 확인해주세요');
      }
    } catch (error) {
      console.error('Failed to check robot status:', error);
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

        const datas: SearchGameTitle[] = JSON.parse(response.body);

        const newGameTitleList = datas.map((it: SearchGameTitle) => it.name);
        const uniqueGameTitleList = Array.from(new Set(newGameTitleList));

        setGameTitleSearchResult(uniqueGameTitleList);
      } catch (error) {
        console.error('Error fetching game titles:', error);
        setGameTitleSearchResult([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 디바운싱을 위해 300ms 대기
  };

  return (
    <>
      <PageFrame
        bodyContent={
          <Container size="lg">
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
                placeholder="10글자 이상 작성하세요"
              />
              <TextInput
                label="별명"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
              />
              <br />
              <Group justify="flex-end">
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

export default ChannelCreate;

interface SearchGameTitle {
  id: number;
  name: string;
}
