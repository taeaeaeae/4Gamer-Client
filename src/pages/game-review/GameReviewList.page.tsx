import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getGameReviewList } from '../../api/gameReviewApi';
import { getGameReviewReactionList } from '../../api/VoteApi';
import GameReviewItem from '../../components/game-review/GameReviewItem';
import GameReviewInput from '../../components/game-review/GameReviewInput';
import './GameReviewList.page.css';
import { PageFrame } from '../../components/Common/PageFrame/PageFrame';
import { getMemberInfo } from '../../api/member';

const GameReviewList = () => {
  const [gameReviewList, setGameReviewList] = useState<GameReviewList[]>([]);
  const [page, setPage] = useState(0);
  const size = 10;
  const totalCount = useRef(1);
  const { ref, inView } = useInView();
  const [voteList, setVoteList] = useState<VoteList[]>([]);
  let callVoteList = 0;
  const hasAccessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const getMemberId = async () => {
    if (accessToken !== null) {
      const data = await getMemberInfo(accessToken);
      localStorage.setItem('4gamer_member_id', data.id);
    }
  };

  const fetchGameReviewReactionList = async () => {
    if (callVoteList < 1 && accessToken !== null) {
      callVoteList += 1;

      const data = await getGameReviewReactionList();

      getMemberId();
      setVoteList(data);
      fetchGameReviewList();
    }
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

  const bodyContent = (
    <>
      <div className="game-review-list-container">
        {hasAccessToken ? (
          <GameReviewInput id="" gameTitle="" point="" description="" handleFunction={() => {}} />
        ) : (
          <div className="login">
            <p>로그인 후 리뷰 작성이 가능합니다.</p>
            <button type="button" onClick={() => navigate('/login')}>
              로그인
            </button>
          </div>
        )}

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
      </div>
      <div ref={ref}></div>
    </>
  );

  return (
    <PageFrame
      headerContent={undefined}
      bodyContent={bodyContent}
      navbarContent={undefined}
      asideContent={undefined}
      footerContent={undefined}
    />
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
