import { starFill, halfStar } from '../../assets/index';

function GameReviewScore(score: GameReviewScore) {
  const count = [...Array(~~(score.score / 2))];
  const isAdd = score.score % 2 === 1;

  return (
    <div>
      {count.map((_, index) => (
        <img
          key={index}
          className="review-score"
          src={starFill}
          alt="star"
          style={{ width: '25px' }}
        />
      ))}
      {isAdd && (
        <img className="review-score" src={halfStar} alt="half-star" style={{ width: '25px' }} />
      )}
    </div>
  );
}

export default GameReviewScore;

interface GameReviewScore {
  score: number;
}
