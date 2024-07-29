import { useNavigate } from 'react-router-dom';

import GameReviewScore from './GameReviewScore';
import { dateFormat } from '../../util/dateUtil';
import { thumbsUpFill, thumbsUpBlank, thumbsDownFill, thumbsDownBlank } from '@/assets/index';
import './GameReviewItem.css';
import { deleteGameReview } from '@/api/GameReviewApi';

function GameReviewItem(item: GameReviewItem) {
  localStorage.setItem(
    // TEST용
    'accessToken',
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiM2E3NzY5Ny1jMGY2LTQxNjMtOTRlNC0zYTk4NWM1NTE5ODkiLCJpc3MiOiI0Z2FtZXIuY29tIiwiaWF0IjoxNzIyMjY1ODQzLCJleHAiOjE3MjI4NzA2NDMsImVtYWlsIjoiaGVsbG91ODM2M0BuYXZlci5jb20iLCJyb2xlIjoiQ0hBTk5FTF9BRE1JTiJ9.zyLIhSh9ZPy73y2ZVCyMP-W2Y1y-V_X7MhyBFzBeoyk'
  );
  localStorage.setItem('4gamer_member_id', 'b3a77697-c0f6-4163-94e4-3a985c551989'); // TEST용

  const navigate = useNavigate();
  const memberId = localStorage.getItem('4gamer_member_id');

  return (
    <div className="game-review-item-container">
      <h2>{item.gameTitle}</h2>
      <div className="top-info">
        <div>
          <span>{dateFormat(item.createdAt)}</span>
          {item.memberId === memberId && (
            <div className="button-menu">
              <button
                type="button"
                onClick={() => {
                  navigate('/game-review/new', {
                    state: {
                      gameTitle: item.gameTitle,
                      point: item.point,
                      description: item.description,
                    },
                  });
                }}
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('정말 삭제하시겠습니까?')) {
                    deleteGameReview(String(item.id));
                    setTimeout(() => {
                      navigate('/game-reviews');
                    }, 500);
                  }
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <div className="width-125px">
          <GameReviewScore score={Number(item.point)} />
        </div>
      </div>
      <p className="description">{item.description}</p>
      <div className="votes">
        <div>
          <img className="thumbs-icon" src={thumbsUpBlank} alt="추천" />
          <span>{item.upvotes}</span>
        </div>
        <div>
          <img className="thumbs-icon" src={thumbsDownBlank} alt="비추천" />
          <span>{item.downvotes}</span>
        </div>
      </div>
    </div>
  );
}

export default GameReviewItem;

interface GameReviewItem {
  id: number;
  gameTitle: string;
  point: number;
  description: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  memberId: string;
}
