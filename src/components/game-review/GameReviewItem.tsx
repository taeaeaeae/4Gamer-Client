import './GameReviewItem.css';
import GameReviewScore from './GameReviewScore';
import { dateFormat } from '../../util/dateUtil';

function GameReviewItem(item: GameReviewItemInfo) {
  return (
    <>
      <div className="game-review-container">
        <div>
          <img
            className="game-review-img"
            src="https://cdn.gametoc.co.kr/news/photo/201809/49202_94286_458.JPG"
            alt={`${item.gameTitle} 이미지`}
          />
        </div>
        <div>
          <h2 className="game-title">{item.gameTitle}</h2>
          <div className="align-right">
            <GameReviewScore score={item.point} />
          </div>
          <p>{dateFormat(item.createdAt)}</p>
          <p className="description">{item.description}</p>
        </div>
      </div>
    </>
  );
}

export default GameReviewItem;

interface GameReviewItemInfo {
  id: number;
  gameTitle: string;
  point: number;
  description: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
}
