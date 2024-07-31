import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { getGameReviewList } from '../../api/GameReviewApi';
import { getGameReviewReactionList } from '@/api/VoteApi';
import GameReviewItem from '@/components/game-review/GameReviewItem';
import GameReviewInput from '@/components/game-review/GameReviewInput';
import './GameReviewListPage.css';

const GameReviewList = () => {
  const [gameReviewList, setGameReviewList] = useState<GameReviewList[]>([]);
  const [page, setPage] = useState(0);
  const size = 10; // 한 번에 가져올 데이터 개수
  const totalCount = useRef(1);
  const { ref, inView } = useInView();
  const [voteList, setVoteList] = useState<[VoteList]>();

  const fetchGameReviewReactionList = async () => {
    const data = await getGameReviewReactionList();

    setVoteList(data);
  };

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
  useEffect(() => {
    fetchGameReviewReactionList();
  }, []);

  return (
    <div className="game-review-list-container">
      <GameReviewInput
        id={0}
        gameTitle=""
        point=""
        description=""
        upvotes={0}
        downvotes={0}
        createdAt=""
        updatedAt=""
        memberId=""
        isUpvoting={false}
        handleFunction={() => {}}
      />

      {gameReviewList?.map((value: GameReviewList) => (
        <GameReviewItem
          key={value.id}
          id={value.id}
          gameTitle={value.gameTitle}
          point={value.point}
          description={value.description}
          upvotes={value.upvotes}
          downvotes={value.downvotes}
          createdAt={value.createdAt}
          updatedAt={value.updatedAt}
          memberId={value.memberId}
          isUpvoting={voteList?.filter((v) => v.gameReviewId === value.id)[0]?.isUpvoting}
        />
      ))}
      <div ref={ref}></div>
    </div>
  );
};

export default GameReviewList;

interface GameReviewList {
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

interface VoteList {
  gameReviewId: number;
  isUpvoting: boolean;
}
