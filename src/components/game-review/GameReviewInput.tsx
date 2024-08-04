import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { createGameReview, updateGameReview } from '../../api/gameReviewApi';
import './GameReviewInput.css';
import { searchGameTitle } from '../../api/IgdbApi';

const GameReviewInput = (item: GameReviewInput) => {
  const [gameTitle, setGameTitle] = useState(item.gameTitle === undefined ? '' : item.gameTitle);
  const [point, setPoint] = useState(item.point === '' ? '1' : item.point);
  const [description, setDescription] = useState(item.description);
  const [gameTitleSearchResult, setGameTitleSearchResult] = useState<string[]>([]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      if (item.id.length === 0) {
        await createGameReview({
          gameTitle,
          point,
          description,
        });

        window.location.reload();
      } else {
        await updateGameReview(String(item.id), {
          gameTitle,
          point,
          description,
        });

        item.handleFunction(false, { gameTitle, point, description });
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        window.alert(e.response?.data.message);
      }
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

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (event.target.className !== 'game-title-search-result-item') {
        setGameTitleSearchResult([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);
  }, [gameTitle, point, description]);

  return (
    <div className="game-review-input-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label className="game-title-search-bar">
            제목:
            <input
              className="game-title"
              type="text"
              name="title"
              onChange={(e) => setGameTitle(e.target.value)}
              value={gameTitle}
              placeholder="제목 일부를 입력 후 검색 시 등록 가능한 제목을 확인할 수 있습니다."
            />
            {gameTitleSearchResult.length !== 0 && (
              <div
                className="game-title-search-result"
                role="button"
                onClick={(e) => {
                  setGameTitle(e.target.innerText);
                  setGameTitleSearchResult([]);
                }}
                onKeyDown={() => {}}
                tabIndex={0}
              >
                {gameTitleSearchResult.map((value, index) => (
                  <button type="button" key={index} className="game-title-search-result-item">
                    {value}
                  </button>
                ))}
              </div>
            )}
          </label>
          <button type="button" onClick={() => checkGameTitle()}>
            검색
          </button>
          <label>
            평점:
            <select
              className="point"
              name="point"
              onChange={(e) => setPoint(e.target.value)}
              value={~~point === 0 ? 1 : ~~point}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </label>
        </div>
        <div className="direction-column">
          <label htmlFor="description" id="description">
            내용:
          </label>
          <textarea
            className="description"
            name="description"
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="최소 10자에서 최대 1024자까지 입력 가능합니다"
            minLength={10}
            maxLength={1024}
          />
        </div>
        <button type="submit">{item.id.length === 0 ? '등록' : '수정'}</button>
      </form>
    </div>
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
