import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ActionIcon, Avatar, Group, Menu, Paper, Stack, Text, Title, Tooltip, UnstyledButton } from '@mantine/core';
import { IconDots, IconEye, IconPencil, IconThumbDown, IconThumbDownFilled, IconThumbUp, IconThumbUpFilled, IconTrash } from '@tabler/icons-react';

import { deletePost } from '@api/posts';
import { updatePostReaction, deletePostReaction } from '@api/reaction';

import UserProfile from '@components/UserProfile';

import { prettyTime } from '@/util/dateUtil';
import { metricNumber } from '@/util/numberUtil';
import { PostSimplifiedResponse } from '@/responseTypes';

export function PostSummary({ channelId, boardId, postId, post }:
  { channelId: bigint, boardId: bigint, postId: bigint,
    post: PostSimplifiedResponse & { isUpvoting: number } }) {
  const NULL = 0;
  const FALSE = 1;
  const TRUE = 2;

  const memberId = localStorage.getItem('4gamer_member_id');

  const deletePostInternal = async () => {
    await deletePost(channelId, boardId, postId);
    window.location.reload();
  };

  const [isUpvoting, setIsUpvoting] = useState<number>(post.isUpvoting);
  const [upvotes, setUpvotes] = useState<bigint>(post.upvotes);
  const [downvotes, setDownvotes] = useState<bigint>(post.downvotes);

  const setPostReaction = async (newIsUpvoting: number) => {
    if (newIsUpvoting === NULL) {
      await deletePostReaction(channelId, boardId, postId);
      if (isUpvoting === TRUE) {
        setUpvotes(BigInt(upvotes) - 1n);
      } else {
        setDownvotes(BigInt(downvotes) - 1n);
      }
      setIsUpvoting(NULL);
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
      setIsUpvoting(newIsUpvoting);
    }
  };

  useEffect(() => {}, [isUpvoting]);

  return (
      <Paper shadow="xs" withBorder p="xl">
        <Stack>
          <Group justify="space-between">
            <Group>
              <Avatar radius="xl" />
              <UserProfile memberId={post.memberId}>
                <Text>{post.author}</Text>
              </UserProfile>
              <Text>{prettyTime(post.createdAt)}</Text>
            </Group>
            <Group>
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
                        component={Link}
                        to={`./${postId}/edit`}
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
          </Group>

          <Group justify="space-between">
            <UnstyledButton component={Link} to={`./${post.id}`} relative="path">
              <Title order={3} lineClamp={1}>{post.title}</Title>
            </UnstyledButton>
            <Group justify="space-between" w="300">
              <Group>
                <IconEye stroke={1.5} />
                <Tooltip label={`${post.view}`}>
                  <Text>{metricNumber(post.view)}</Text>
                </Tooltip>
              </Group>
              {/* <Group>
                <ActionIcon variant="transparent" color="gray">
                  <IconMessage stroke={1.5} />
                </ActionIcon>
                <Text>{metricNumber(post.comments)}</Text>
              </Group> */}
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
                <Tooltip label={`${upvotes}`}>
                  <Text>{metricNumber(upvotes)}</Text>
                </Tooltip>
              </Group>
              <Group>
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
                <Tooltip label={`${downvotes}`}>
                  <Text>{metricNumber(downvotes)}</Text>
                </Tooltip>
              </Group>
            </Group>
          </Group>
        </Stack>
      </Paper>
  );
}
