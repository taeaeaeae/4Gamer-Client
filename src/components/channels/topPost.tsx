import { Text, Table, Group, Anchor } from '@mantine/core';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { topPost } from '../../api/channelApi';

export function TopPost({ channelId }: { channelId: any }) {
  const [topPosts, setTopPosts] = useState<Post[]>([]);
  // const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // const handleClick = (boardId: any, postId: any) => () => {
  //   navigate(`/channels/${channelId}/boards/${boardId}/posts/${postId}`)
  // };

  const fetchToplList = async () => {
    const data = await topPost(channelId);
    setTopPosts(data);
  };

  useEffect(() => {
    fetchToplList();
  }, [channelId]);

  const data = topPosts;
  console.log(data);

  const rows = topPosts.map((row) => (
      <>
        <Table.Tr key={row.id}>
            <Table.Td>
                {/* <Anchor component="button" fz="sm" onClick={handleClick(row.board.id, row.id)}> */}
                <Anchor fz="sm" component={Link} to={`/channels/${channelId}/boards/${row.board.id}/posts/${row.id}`}>
                    {row.title}
                </Anchor>
            </Table.Td>
            <Table.Td>
                <Text>
                    {row.upvotes}
                </Text>
            </Table.Td>
        </Table.Tr>
      </>
    ));

  return (
    <>
      <Group justify="space-between" m={10}>
          <Text>인기게시물</Text>
      </Group>
      <Table.ScrollContainer minWidth={10}>
          <Table verticalSpacing="xs">
              <Table.Thead>
                  <Table.Tr>
                      <Table.Th>제목</Table.Th>
                      <Table.Th>좋아요</Table.Th>
                  </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
          </Table>
      </Table.ScrollContainer>
    </>
  );
}

export default TopPost;

interface Post {
    id: number;
    title: string;
    body: string;
    views: number;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    author: string;
    board: Board;
}

export interface Board {
    id: string;
    title: string;
}
