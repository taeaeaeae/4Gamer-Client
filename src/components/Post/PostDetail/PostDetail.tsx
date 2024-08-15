import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import { ActionIcon, Badge, Group, Menu, Paper, Space, Stack, TextInput, Text, Title, TypographyStylesProvider, UnstyledButton } from '@mantine/core';
import { useValidatedState } from '@mantine/hooks';
import { IconArrowLeft, IconDots, IconPencil, IconSend, IconThumbUp, IconThumbUpFilled, IconThumbDown, IconThumbDownFilled, IconTrash } from '@tabler/icons-react';

import { generateHTML } from '@tiptap/core';
import { Link } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';

import Image from '@tiptap/extension-image';

import { getMemberInfo } from '@api/member';
import { getPost, getTagsInPost, getComments, deletePost } from '@api/posts';
import { addComment } from '@api/comment';
import { deletePostReaction, getPostReactionList, getCommentReactionList, updatePostReaction } from '@api/reaction';

import UserProfile from '@components/UserProfile';

import { CommentResponse, PostResponse, PostTagResponse, ReactionResponse } from '@/responseTypes';

import { metricNumber } from '@/util/numberUtil';
import { prettyTime } from '@/util/dateUtil';
import { Comment } from './Comment';

// export function PostDetail({ post, comments, tags }:
export function PostDetail({ channelId, boardId, postId }:
  { channelId: bigint, boardId: bigint, postId: bigint }
) {
  const NULL = 0;
  const FALSE = 1;
  const TRUE = 2;

  const accessToken = localStorage.getItem('accessToken');
  const memberId = localStorage.getItem('4gamer_member_id');
  const navigate = useNavigate();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [comments, setComments] = useState<Array<CommentResponse & { isUpvoting: number }>>([]);
  const [tags, setTags] = useState<Array<PostTagResponse>>([]);
  const [upvotes, setUpvotes] = useState<bigint>(0n);
  const [downvotes, setDownvotes] = useState<bigint>(0n);
  const [isUpvoting, setIsUpvoting] = useState<number>(NULL);
  const { ref, inView } = useInView();
  const [commentsPage, setCommentsPage] = useState<bigint>(0n);
  const commentsSize = 10n;
  const [isCommentsAllLoaded, setIsCommentsAllLoaded] = useState<boolean>(false);
  const [totalComments, setTotalComments] = useState<bigint>(0n);

  const [{
    value: newCommentContent,
    valid: isNewCommentContentValid,
  }, setNewCommentContent] = useValidatedState<string>(
    '',
    (content) => (content.length >= 2 && content.length <= 256),
    true
  );
  const [bodyContent, setBodyContent] = useState<string>('');

  const editorExtensions = [
    StarterKit,
    Underline,
    Link,
    Superscript,
    SubScript,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image.configure({ inline: true, allowBase64: false, HTMLAttributes: { class: 'uploaded-image' } }),
  ];

  const fetchMemberId = async () => {
    if (accessToken !== null) {
      const data = await getMemberInfo(accessToken);
      localStorage.setItem('4gamer_member_id', data.id);
    }
  };

  const fetchTags = async () => {
    const data = await getTagsInPost(channelId, boardId, postId);
    setTags(data);
  };

  const fetchPost = async () => {
    const postReactions = await getPostReactionList();

    const data = await getPost(channelId, boardId, postId);
    setPost(data);
    setBodyContent(
      generateHTML(
        JSON.parse(data.body),
        editorExtensions
      )
    );

    setUpvotes(data.upvotes);
    setDownvotes(data.downvotes);

    setIsUpvoting(
      postReactions.some((reaction: ReactionResponse) => (reaction.id === data.id))
      ? (postReactions.find((reaction: ReactionResponse) => (
            reaction.id === data.id
          )).isUpvoting ? TRUE : FALSE
        )
      : NULL
    );
  };

  const fetchComments = async () => {
    if (inView && !isCommentsAllLoaded) {
      const commentReactions = await getCommentReactionList();
      const data = await getComments(channelId, boardId, postId, commentsPage, commentsSize);
      setTotalComments(data.totalElements);
      if (!data.last) {
        setIsCommentsAllLoaded(false);
        setCommentsPage(commentsPage + 1n);
      } else {
        setIsCommentsAllLoaded(true);
      }
      await setComments(data.content.map((each: CommentResponse) => (
        {
          ...each,
          isUpvoting: (
            commentReactions.some((reaction: ReactionResponse) => (reaction.id === each.id))
            ? (commentReactions.find((reaction: ReactionResponse) => (
                  reaction.id === each.id
                )).isUpvoting ? TRUE : FALSE
              )
            : NULL
          ),
        }
      )).concat(comments));
    }
  };

  const addNewComment = async () => {
    if (!isNewCommentContentValid) return;
    const response = await addComment(channelId, boardId, postId, { content: newCommentContent });
    setComments([response].concat(comments));
    setNewCommentContent('');
    window.location.reload();
  };

  const setPostReaction = async (newIsUpvoting: number) => {
    if (newIsUpvoting === NULL) {
      await deletePostReaction(channelId, boardId, postId);
      if (isUpvoting === TRUE) {
        setUpvotes(BigInt(upvotes) - 1n);
      } else {
        setDownvotes(BigInt(downvotes) - 1n);
      }
    } else {
      await updatePostReaction(channelId, boardId, postId, (newIsUpvoting === TRUE));
      if (isUpvoting !== NULL) {
        if (newIsUpvoting === TRUE) {
          setDownvotes(BigInt(downvotes) - 1n);
        } else {
          setUpvotes(BigInt(upvotes) - 1n);
        }
      }
      if (newIsUpvoting === TRUE) {
        setUpvotes(BigInt(upvotes) + 1n);
      } else {
        setDownvotes(BigInt(downvotes) + 1n);
      }
    }
    setIsUpvoting(newIsUpvoting);
  };

  const deletePostInternal = async () => {
    await deletePost(channelId, boardId, postId);
    navigate('../');
  };

  useEffect(() => {
    fetchMemberId();
    fetchPost();
    fetchTags();
  }, [postId, isUpvoting]);

  useEffect(() => {
    fetchComments();
  }, [inView]);

  if (post) {
    return (
      <Stack gap="xl">
        <UnstyledButton component={RouterLink} to="../" relative="path">
          <Group>
            <ActionIcon variant="transparent" color="gray">
              <IconArrowLeft stroke={1.5} />
            </ActionIcon>
            <Text>게시판으로 돌아가기</Text>
          </Group>
        </UnstyledButton>
        <Stack>
          <Paper withBorder p="xl">
            <Group justify="space-between">
              <Title order={1} lineClamp={1}>{post.title}</Title>
              {
                (post.memberId === memberId) ?
                (
                  <Menu>
                    <Menu.Target>
                      <ActionIcon variant="transparent" color="gray">
                        <IconDots stroke={1.5} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      {/* <Menu.Item leftSection={<IconFlag stroke={1.5} />}>
                        신고하기
                      </Menu.Item> */}
                      <Menu.Item
                        leftSection={<IconPencil stroke={1.5} />}
                        component={RouterLink}
                        to="./edit"
                        relative="path"
                      >
                        수정
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconTrash stroke={1.5} />}
                        onClick={() => deletePostInternal()}
                      >
                        삭제
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : <></>
              }
            </Group>
            <Space h="xs" />
            <Group>
              <UserProfile memberId={post.memberId}>
                <Text c="dimmed">By {post.author}</Text>
              </UserProfile>
              <Text c="dimmed">@ {prettyTime(post.createdAt)} 마지막 수정: ${prettyTime(post.updatedAt)}</Text>
            </Group>
            <Space h="xl" />
            <Group justify="space-between">
              <Group>
              {
                tags?.map((value, index) =>
                  <Badge key={index} color="blue">
                    #{value.name}
                  </Badge>
                )
              }
              </Group>
              <Group>
                <ActionIcon
                  variant="transparent"
                  color="gray"
                  onClick={() => setPostReaction(
                    (isUpvoting === TRUE)
                    ? NULL
                    : TRUE
                  )}
                >
                  {
                    (isUpvoting === TRUE)
                    ? <IconThumbUpFilled stroke={1.5} />
                    : <IconThumbUp stroke={1.5} />
                  }
                </ActionIcon>
                <Text>{metricNumber(post.upvotes)}</Text>
                <ActionIcon
                  variant="transparent"
                  color="gray"
                  onClick={() => setPostReaction(
                    (isUpvoting === FALSE)
                    ? NULL
                    : FALSE
                  )}
                >
                  {
                    (isUpvoting === FALSE)
                    ? <IconThumbDownFilled stroke={1.5} />
                    : <IconThumbDown stroke={1.5} />
                  }
                </ActionIcon>
                <Text>{metricNumber(post.downvotes)}</Text>
              </Group>
            </Group>
          </Paper>
          {/* <Divider my="xl" /> */}
          <Paper withBorder p="xl">
            <TypographyStylesProvider>
              <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
            </TypographyStylesProvider>
          </Paper>
        </Stack>
        <Paper withBorder p="xl">
          <Stack gap="md">
            <Title order={2}>댓글 ({`${totalComments}`}개)</Title>
            {
              comments?.map(
                (eachComment: CommentResponse & { isUpvoting: number }, index: number) =>
                <Comment
                  key={index}
                  channelId={channelId}
                  boardId={boardId}
                  postId={postId}
                  commentId={eachComment.id}
                  comment={eachComment}
                  // isCommentUpvoting={
                  //   commentReactionList.some((reaction) => (reaction.id === eachComment.id))
                  //   ? (commentReactionList.find((reaction) => (
                  //         reaction.id === eachComment.id
                  //       )).isUpvoting ? TRUE : FALSE
                  //     )
                  //   : NULL
                  // }
                />
              )
            }
            <div ref={ref}></div>
          </Stack>
          <Space h="xl" />
          <TextInput
            placeholder="댓글 입력..."
            value={newCommentContent}
            onChange={(event) => setNewCommentContent(event.currentTarget.value)}
            error={isNewCommentContentValid ? '' : '댓글은 2자 이상 256자 이하로 작성해주세요'}
            rightSection={
              <>
                <ActionIcon onClick={() => addNewComment()}>
                  <IconSend />
                </ActionIcon>
              </>
            }
          >
          </TextInput>
        </Paper>
      </Stack>
    );
  }
}
