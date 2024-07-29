import fullStar from '../../assets/full-star.svg';
import halfStar from '../../assets/half-star.svg';

function GameReviewScore(score: GameReviewScore) {
  const count = [...Array(~~(score.score / 2))];
  const isAdd = score.score % 2 === 1;

  return (
    <div>
      {count.map((_, index) => (
        <img
          key={index}
          className="review-score"
          src={fullStar}
          alt="full-star"
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
