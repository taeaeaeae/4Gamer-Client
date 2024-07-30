import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createGameReview, updateGameReview } from '@/api/GameReviewApi';
import './GameReviewInput.css';

const GameReviewInput = (item: GameReviewInput) => {
  const [gameTitle, setGameTitle] = useState(item.gameTitle);
  const [point, setPoint] = useState(item.point);
  const [description, setDescription] = useState(item.description);
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (Object.keys(item).length === 0) {
      await createGameReview({
        gameTitle,
        point,
        description,
      });
    } else {
      await updateGameReview(item.id, {
        gameTitle,
        point,
        description,
      });

      navigate('/game-reviews', { replace: true });
    }
  };

  useEffect(() => {}, [gameTitle, point, description]);
  return (
    // 등록 가능한 게임 타이틀 조회: http://localhost:8080/api/v1/igdb/get-name?gameTitle=el - POST
    <div className="game-review-input-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            제목:
            <input
              className="game-title"
              type="text"
              name="title"
              onChange={(e) => setGameTitle(e.target.value)}
              value={gameTitle}
            />
          </label>
          <label>
            평점:
            <select
              className="point"
              name="point"
              onChange={(e) => setPoint(e.target.value)}
              value={~~point}
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
          />
        </div>
        <button type="submit">{Object.keys(item).length === 0 ? '등록' : '수정'}</button>
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
}
