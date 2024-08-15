import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Divider, Group, Paper, Space, Stack, Text, Title } from '@mantine/core';

import { getTopPostList } from '@api/channelApi';

export function TopPostList({ channelId }: { channelId: number }) {
  const [topPosts, setTopPosts] = useState([]);

  useEffect(() => {
    const fetchTopPosts = async () => {
      if (channelId) {
        const data = await getTopPostList(channelId);
        console.log(data);
        setTopPosts(data);
      }
    };
    fetchTopPosts();
  }, [channelId]);
  return (
    <>
      <Paper withBorder p="lg">
        <Title order={3}>인기 게시물</Title>
        <Divider my="sm" />
        <Stack>
          {
            topPosts.map((each: Post, index) =>
              <Text
                key={index}
                lineClamp={1}
                component={Link}
                to={`/channels/${channelId}/boards/${each.board.id}/posts/${each.id}`}
              >
                {each.title}
              </Text>
            )
          }
        </Stack>
      </Paper>
    </>
  );
}

type Post = {
  id: bigint,
  title: string,
  body: string,
  views: bigint,
  upvotes: bigint,
  downvotes: bigint,
  createdAt: typeof Date,
  updatedAt: typeof Date,
  author: string,
  board: Board,
  attachment: string | undefined
};

type Board = {
  id: bigint,
  title: string,
  createdAt: typeof Date,
  updatedAt: typeof Date
};
