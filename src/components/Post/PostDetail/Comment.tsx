import { useEffect, useState } from 'react';

import { ActionIcon, Text, Avatar, Group, Menu, Paper, Space, TextInput, TypographyStylesProvider } from '@mantine/core';
import { useValidatedState } from '@mantine/hooks';
import { IconDeviceFloppy, IconDots, IconPencil, IconThumbUp, IconThumbUpFilled, IconThumbDown, IconThumbDownFilled, IconTrash } from '@tabler/icons-react';

import { deleteComment, updateComment } from '@api/comment';
import { updateCommentReaction, deleteCommentReaction } from '@api/reaction';

import UserProfile from '@components/UserProfile';

import { prettyTime } from '@/util/dateUtil';
import { metricNumber } from '@/util/numberUtil';
import { CommentResponse } from '@/responseTypes';

export function Comment({ channelId, boardId, postId, commentId, comment }:
  { channelId: bigint, boardId: bigint, postId: bigint, commentId: bigint,
    // comment: CommentResponse, isCommentUpvoting: number }) {
      comment: CommentResponse & { isUpvoting: number } }) {
  const NULL = 0;
  const FALSE = 1;
  const TRUE = 2;

  const [isUpvoting, setIsUpvoting] = useState<number>(comment.isUpvoting);
  const [upvotes, setUpvotes] = useState<bigint>(comment.upvotes);
  const [downvotes, setDownvotes] = useState<bigint>(comment.downvotes);
  const memberId = localStorage.getItem('4gamer_member_id');
  const [isModifying, setIsModifying] = useState<boolean>(false);
  // const [commentContent, setCommentContent] = useState<string>(comment.content);

  const [{
    value: commentContent,
    // lastValidValue: _,
    valid: isCommentContentValid,
  }, setCommentContent] = useValidatedState<string>(
    comment.content,
    (content) => (content.length >= 2 && content.length <= 256),
    (comment.content.length >= 2 && comment.content.length <= 256)
  );

  const updateCommentInternal = async (content: string) => {
    if (!isCommentContentValid) return;
    const response = await updateComment(channelId, boardId, postId, commentId, { content });
    comment.content = response.content;
    setIsModifying(false);
  };

  const deleteCommentInternal = async () => {
    await deleteComment(channelId, boardId, postId, commentId);
    window.location.reload();
  };

  const setCommentReaction = async (newIsUpvoting: number) => {
    if (newIsUpvoting === NULL) {
      await deleteCommentReaction(channelId, boardId, postId, commentId);
      if (isUpvoting === TRUE) {
        setUpvotes(BigInt(upvotes) - 1n);
      } else {
        setDownvotes(BigInt(downvotes) - 1n);
      }
      setIsUpvoting(NULL);
    } else {
      await updateCommentReaction(channelId, boardId, postId, commentId, (newIsUpvoting === TRUE));
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
      setIsUpvoting(newIsUpvoting);
    }
  };

  // console.log(isCommentUpvoting);
  // console.log(isUpvoting);

  useEffect(() => {}, [isModifying, isUpvoting]);

  if (comment) {
    return (
      // <Paper withBorder radius="md" className={classes.comment}>
      <Paper withBorder radius="md" p="xl">
        <Group justify="space-between">
          <Group>
            <Avatar
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
              alt="Jacob Warnhalter"
              radius="xl"
            />
            <div>
              <UserProfile memberId={comment.memberId}>
                <Text fz="sm">{comment.author}</Text>
              </UserProfile>
              <Text fz="xs" c="dimmed">{prettyTime(comment.createdAt)}</Text>
            </div>
          </Group>

          <Group>
            <ActionIcon
              variant="transparent"
              color="gray"
              onClick={() => setCommentReaction(
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
            <Text>{metricNumber(upvotes)}</Text>
            <ActionIcon
              variant="transparent"
              color="gray"
              onClick={() => setCommentReaction(
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
            <Text>{metricNumber(downvotes)}</Text>

            {
              (comment.memberId === memberId) ?
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
                      onClick={() => setIsModifying(true)}
                    >
                      수정
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash stroke={1.5} />}
                      onClick={() => deleteCommentInternal()}
                    >
                      삭제
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : <></>
            }
          </Group>
        </Group>
        <Space h="xl" />
        <Group grow>
          {isModifying
            ? (
              <TextInput
                value={commentContent}
                onChange={(event) => setCommentContent(event.currentTarget.value)}
                rightSection={
                  <>
                    <ActionIcon
                      onClick={() => updateCommentInternal(commentContent)}
                    >
                      <IconDeviceFloppy />
                    </ActionIcon>
                  </>
                }
                error={isCommentContentValid ? '' : '댓글은 2자 이상 256자 이하로 작성해주세요'}
              />
            )
            : <Text component="div">{comment.content}</Text>
          }
        </Group>
      </Paper>
    );
  }
}
