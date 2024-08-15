import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box, Button, Flex, Text } from '@mantine/core';
import { getGameReviewList } from '../../api/gameReviewApi';
import { getGameReviewReactionList } from '../../api/VoteApi';
import GameReviewItem from '../../components/game-review/GameReviewItem';
import GameReviewInput from '../../components/game-review/GameReviewInput';
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

  const clearMemberId = () => localStorage.removeItem('4gamer_member_id');

  useEffect(() => {
    fetchGameReviewList();
  }, [inView]);
  useEffect(() => {
    fetchGameReviewReactionList();

    window.addEventListener('beforeunload', clearMemberId);

    return () => {
      clearMemberId();
      window.removeEventListener('beforeunload', clearMemberId);
    };
  }, []);

  const bodyContent = (
    <>
      <Box>
        {hasAccessToken ? (
          <GameReviewInput id="" gameTitle="" point="" description="" handleFunction={() => {}} />
        ) : (
          <Flex direction="column" align="center" gap={20} mb={50}>
            <Text>로그인 후 리뷰 작성이 가능합니다.</Text>
            <Button type="button" w="100%" size="md" onClick={() => navigate('/login')}>
              로그인
            </Button>
          </Flex>
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
            isUpvoting={voteList?.filter((v) => v.id === value.id)[0]?.isUpvoting}
          />
        ))}
      </Box>
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
  id: number;
  isUpvoting: boolean;
}
