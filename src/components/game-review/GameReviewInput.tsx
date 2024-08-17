import { Autocomplete, Button, Group, Paper, Select, Textarea } from '@mantine/core';
import { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { createGameReview, updateGameReview } from '../../api/gameReviewApi';
import { searchGameTitle } from '../../api/IgdbApi';

const GameReviewInput = (item: GameReviewInput) => {
  const [point, setPoint] = useState(item.point === '' ? '1' : item.point);
  const [description, setDescription] = useState(item.description);
  const [gameTitleSearchResult, setGameTitleSearchResult] = useState<string[]>(
    item.gameTitle === undefined ? [] : [item.gameTitle]
  );
  const gameTitleRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      if (item.id.length === 0) {
        await createGameReview({
          gameTitle: gameTitleRef.current!.value,
          point,
          description,
        });

        window.location.reload();
      } else {
        await updateGameReview(String(item.id), {
          point,
          description,
        });

        item.handleFunction(false, { point, description });
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        window.alert(e.response?.data.message);
      }
    }
  };

  const checkGameTitle = async (word: string) => {
    const data = await searchGameTitle(word);
    const newGameTitleList: [] = JSON.parse(data.body).map((it: SearchGameTitle) => it.name);
    // const newGameTitleList: Array<string> = [...new Set(JSON.parse(data.body).map((it: SearchGameTitle) => it.name))];
    // const newGameTitleList: [] = JSON.parse(data.body).map((it: SearchGameTitle) => ({ value: it.name, label: it.name}));

    // setGameTitleSearchResult([...new Set(newGameTitleList)]);
    setGameTitleSearchResult(newGameTitleList);
  };

  useEffect(() => {}, [point, description, gameTitleSearchResult]);

  return (
    <Paper bd="1px solid dark.9" p={20} mt={20}>
      <form onSubmit={handleSubmit}>
        {item.id.length === 0 ? (
          <Autocomplete
            label="제목"
            withAsterisk
            w="100%"
            onChange={(e) => checkGameTitle(e)}
            data={gameTitleSearchResult}
            placeholder="게임이름을 입력해주세요."
            ref={gameTitleRef}
          />
        ) : (
          <h2>{gameTitleSearchResult}</h2>
        )}

        <Textarea
          label="내용"
          withAsterisk
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="최소 10자에서 최대 1024자까지 입력 가능합니다"
          minLength={10}
          maxLength={1024}
          rows={10}
        />
        <Select
          label="평점"
          withAsterisk
          data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
          onChange={(_value, option) => setPoint(option.value)}
          value={point}
        />
        <Group justify="flex-end" mt={20}>
          <Button type="submit">{item.id.length === 0 ? '등록' : '수정'}</Button>
        </Group>
      </form>
    </Paper>
  );
};

export default GameReviewInput;

interface GameReviewInput {
  id: string;
  gameTitle: string;
  point: string;
  description: string;
  handleFunction: Function;
}

interface SearchGameTitle {
  id: number;
  name: string;
}
