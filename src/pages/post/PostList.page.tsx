import { useEffect, useState, Fragment } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppShell, Button, ScrollArea, NavLink, Space, Stack, Title } from '@mantine/core';

import { getBoard, getBoards } from '@api/boardApi';
import { checkBlack, getChannelItem } from '@api/channelApi';
import { getPosts } from '@api/posts';
import { getPostReactionList } from '@api/reaction';

import { PageFrame } from '@components/Common/PageFrame/PageFrame';
import { PostSummary } from '@components/Post/PostList/PostSummary';
import { TopPost } from '@components/channels/topPost';

import { PostSimplifiedResponse, ReactionResponse, BoardResponse } from '@/responseTypes';

export function PostListPage() {
  const NULL = 0;
  const FALSE = 1;
  const TRUE = 2;

  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const { channelId, boardId } = (useParams() as unknown) as { channelId: bigint, boardId: bigint };
  const [posts, setPosts] = useState<Array<PostSimplifiedResponse & { isUpvoting: number }>>([]);
  const [boards, setBoards] = useState<Array<BoardResponse>>([]);
  const { ref, inView } = useInView();
  const [postsPage, setPostsPage] = useState<bigint>(0n);
  const postsSize = 10n;
  const [isPostsAllLoaded, setIsPostsAllLoaded] = useState<boolean>(false);
  const [boardTitle, setBoardTitle] = useState<string>('');
  const [channelTitle, setChannelTitle] = useState<string>('');

  const fetchChannel = async () => {
    const response = await getChannelItem(channelId);
    setChannelTitle(response.title);
  };

  const fetchBoards = async () => {
    const data = await getBoards(channelId);
    setBoards(data);
  };

  const fetchBoard = async () => {
    const response = await getBoard(channelId, boardId);
    setBoardTitle(response.title);
  };

  const fetchPosts = async () => {
    if (inView && !isPostsAllLoaded) {
      const postReactions = accessToken ? await getPostReactionList() : undefined;
      const data = await getPosts(channelId, boardId, postsPage, postsSize);
      console.log(data);
      if (!data.last) {
        setIsPostsAllLoaded(false);
        setPostsPage(postsPage + 1n);
      } else {
        setIsPostsAllLoaded(true);
      }
      await setPosts(data.content.map((each: PostSimplifiedResponse) => (
        {
          ...each,
          isUpvoting: (
            postReactions ? postReactions.some((reaction: ReactionResponse) => (reaction.id === each.id))
              ? (postReactions.find((reaction: ReactionResponse) => (
                reaction.id === each.id
              )).isUpvoting ? TRUE : FALSE
              )
              : NULL
              : undefined),
        }
      )).concat(posts));
    }
  };
  const checkBlacklists = async () => {
    if (await checkBlack(channelId)) {
      navigate('/');
      alert('해당 채널로의 접근이 차단되었습니다. 관리자에게 문의하세요.');
    }
  };

  useEffect(() => {
    checkBlacklists();
    fetchChannel();
    fetchBoards();
    fetchBoard();
    fetchPosts();
  }, [channelId, boardId]);

  useEffect(() => {
    fetchPosts();
  }, [inView]);

  const postListBody = (
    <>
      <Stack gap="xl">
        <Button fullWidth component={Link} to="./new" relative="path">게시물 작성하기</Button>
        {posts
          .map((each, index) => (
            <Fragment key={index}>
              <PostSummary channelId={channelId} boardId={boardId} postId={each.id} post={each} />
            </Fragment>
          ))
        }
        <div ref={ref} />
      </Stack>
    </>
  );

  const postListNavbar = (
    <>
      <AppShell.Section>
        <NavLink component="a" href="/game-reviews" label="게임 리뷰 페이지" />
      </AppShell.Section>
      <Space h="md" />
      <AppShell.Section>게시판 목록</AppShell.Section>
      <AppShell.Section grow my="md" component={ScrollArea}>
        {
          boards.map((each, index) => (
            // <NavLink component={Link} to={`../../${each.id}/posts`} relative="path" key={index} label={each.title} />
            <NavLink component="a" href={`/channels/${channelId}/boards/${each.id}/posts`} key={index} label={each.title} />
          ))
        }
      </AppShell.Section>
    </>
  );

  const postListHeader = (
    <Title order={3}>{channelTitle} / {boardTitle}</Title>
  );

  return (
    <>
      <PageFrame
        bodyContent={postListBody}
        navbarContent={postListNavbar}
        headerContent={postListHeader}
        asideContent={
          <TopPost channelId={channelId} />
        }
        footerContent={undefined}
      />
    </>
  );
}
