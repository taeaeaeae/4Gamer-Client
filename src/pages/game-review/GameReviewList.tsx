import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { getGameReviewList } from '../../api/gameReviewApi';
import GameReviewItem from '@/components/game-review/GameReviewItem';

const GameReviewList = () => {
  const [gameReviewList, setGameReviewList] = useState<GameReviewListInfo[]>([]);
  const [page, setPage] = useState(0);
  const size = 10; // 한 번에 가져올 데이터 개수
  const totalCount = useRef(1);
  const { ref, inView } = useInView();

  const fetchGameReviewList = async () => {
    if (inView && gameReviewList.length < totalCount.current) {
      const data = await getGameReviewList(page, size);

      setGameReviewList([...gameReviewList, ...data.content]);
      setPage(page + 1);

      totalCount.current = data.totalElements;
    }
  };

  useEffect(() => {
    fetchGameReviewList();
  }, [inView]);

  return (
    <div>
      {gameReviewList?.map((value: GameReviewListInfo) => (
        <div key={value.id}>
          <GameReviewItem
            id={value.id}
            gameTitle={value.gameTitle}
            point={value.point}
            description={value.description}
            upvotes={value.upvotes}
            downvotes={value.downvotes}
            createdAt={value.createdAt}
            updatedAt={value.updatedAt}
          />
        </div>
      ))}
      <div ref={ref}></div>
    </div>
  );
};

export default GameReviewList;

interface GameReviewListInfo {
  id: number;
  gameTitle: string;
  point: number;
  description: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
}
