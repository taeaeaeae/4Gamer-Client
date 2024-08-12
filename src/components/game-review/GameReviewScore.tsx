import { IconStarFilled, IconStarHalfFilled } from '@tabler/icons-react';

function GameReviewScore(score: GameReviewScore) {
  const count = [...Array(~~(score.score / 2))];
  const isAdd = score.score % 2 === 1;

  return (
    <div>
      {count.map(() => (
        <IconStarFilled />
      ))}
      {isAdd && <IconStarHalfFilled />}
    </div>
  );
}

export default GameReviewScore;

interface GameReviewScore {
  score: number;
}
