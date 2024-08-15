import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppShell, NavLink, ScrollArea, Title } from '@mantine/core';

import { getBoard, getBoards } from '@api/boardApi';
import { getBlacklist, getChannelItem } from '@api/channelApi';
import { getMemberInfo } from '@api/member';
import { getPost, getTagsInPost, getComments } from '@api/posts';
// import { getPostReactionList, getCommentReactionList } from '@api/reaction';
import { BoardResponse, ChannelBlacklistResponse, CommentResponse, PostResponse, PostTagResponse, ReactionResponse } from '@/responseTypes';

import { PageFrame } from '@/components/Common/PageFrame/PageFrame';
import { PostDetail } from '@/components/Post/PostDetail/PostDetail';
import { TopPost } from '@components/channels/topPost';

export function PostDetailPage() {
  const { channelId, boardId, postId } = (
    useParams() as unknown
  ) as { channelId: bigint, boardId: bigint, postId: bigint };
  const navigate = useNavigate();
  const memberId = localStorage.getItem('4gamer_member_id');
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [post, setPost] = useState<PostResponse | null>(null);
  // const [comments, setComments] = useState<Array<CommentResponse & { isUpvoting: boolean }>>([]);
  // const [tags, setTags] = useState<Array<PostTagResponse>>([]);
  // const [postReactionList, setPostReactionList] = useState<Array<ReactionResponse>>([]);
  // const [commentReactionList, setCommentReactionList] = useState<Array<ReactionResponse>>([]);
  const accessToken = localStorage.getItem('accessToken');
  const [boardTitle, setBoardTitle] = useState<string>('');
  const [channelTitle, setChannelTitle] = useState<string>('');

  const checkBlacklists = async () => {
    await getMemberId();
    const data = await getBlacklist(`${channelId}`);
    if (data.some((each: ChannelBlacklistResponse) => each.memberId === memberId)) {
      alert('해당 채널로의 접근이 차단되었습니다. 관리자에게 문의하세요.');
      navigate('/');
    }
  };

  const getMemberId = async () => {
    if (accessToken !== null) {
      const data = await getMemberInfo(accessToken);
      localStorage.setItem('4gamer_member_id', data.id);
    }
  };

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

  // const fetchTags = async (cId: bigint, bId: bigint, pId: bigint) => {
  //   const data = await getTagsInPost(cId, bId, pId);
  //   setTags(data);
  // };

  // const fetchPostReactionList = async () => {
  //   const data = await getPostReactionList();

  //   getMemberId();
  //   setPostReactionList(data);
  // };

  const fetchPost = async () => {
    const data = await getPost(channelId, boardId, postId);
    setPost(data);
  };

  // const fetchCommentReactionList = async () => {
  //   const data = await getCommentReactionList();

  //   getMemberId();
  //   setCommentReactionList(data);
  // };

  useEffect(() => {
    checkBlacklists();
    fetchChannel();
    fetchBoards();
    fetchBoard();
    fetchPost();
    // fetchTags(channelId, boardId, postId);
    // fetchComments(channelId, boardId, postId);
    // fetchPostReactionList();
    // fetchCommentReactionList();
  }, [postId]);

  const postDetailBody = (
    // <PostDetail post={post!} comments={comments} tags={tags} />
    <PostDetail channelId={channelId} boardId={boardId} postId={postId} />
  );

  const postDetailNavbar = (
    <>
      <AppShell.Section>게시판 목록</AppShell.Section>
      <AppShell.Section grow my="md" component={ScrollArea}>
        {
          boards.map((each, index) => (
            <NavLink component={Link} to={`../../../${each.id}/posts`} relative="path" key={index} label={each.title} />
          ))
        }
      </AppShell.Section>
    </>
  );

  const postDetailHeader = (
    <Title order={3}>{channelTitle} / {boardTitle}</Title>
  );

  // rendering component pattern - old school
  // 위임 component pattern
  if (post) {
    return (
      <>
        <PageFrame
          bodyContent={postDetailBody}
          navbarContent={postDetailNavbar}
          asideContent={
            <TopPost channelId={channelId} />
          }
          headerContent={postDetailHeader}
          footerContent={undefined}
        />
      </>
    );
  }
}
