import classes from '../components/css/Member.module.css';
import cx from 'clsx';
import { 
  useState, 
  useEffect } from 'react';
import {
  getPostList, 
  getMemberInfo } from '../api/member';
import { 
  Card, 
  Avatar, 
  Paper, 
  Text, 
  Table, 
  ScrollArea} from '@mantine/core';

interface Post {
  title: string;
  views: number;
  upvotes: number;
  downvotes: number;
  author: string;
  createdAt: string;
}

export function PostContainer() {
  const [scrolled, setScrolled] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          console.error("로컬 스토리지에서 토큰을 찾을 수 없습니다.");
          return;
        }

        const userInfo = await getMemberInfo(accessToken);
        setUserData({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.nickname,
          avatarUrl: '',
        });

      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPostList();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const rows = posts.map((post, index) => (
    <Table.Tr key={index}>
      <Table.Td>{post.title}</Table.Td>
      <Table.Td>{post.views ?? 0}</Table.Td>
      <Table.Td>{post.upvotes}</Table.Td>
      <Table.Td>{post.downvotes}</Table.Td>
      <Table.Td>{post.author}</Table.Td>
      <Table.Td>{new Date(post.createdAt).toLocaleDateString()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
      <Paper shadow="md" radius="lg" style={{ width: 1100, maxWidth: '100%', padding: '1rem' }}>
          <Text fz="xl" fw={700} mb="md">
            게시물
          </Text>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Card withBorder padding="xl" radius="md" className={classes.card} style={{ width: 300, marginRight: '1rem' }}>
            <Card.Section h={140} style={{ backgroundImage: '' }} />
            <Avatar
              src={userData.avatarUrl}
              size={130}
              radius={80}
              mx="auto"
              mt={-68}
              mb={50}
              className={classes.avatar}
            />
            <Text ta="center" fz="lg" fw={500} mt="sm">
              {userData.name}
            </Text>
          </Card>
            <ScrollArea style={{ flexGrow: 1, height: 300 }}>
              <Table>
                <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                  <Table.Tr>
                    <Table.Th>제목</Table.Th>
                    <Table.Th>조회수</Table.Th>
                    <Table.Th>추천</Table.Th>
                    <Table.Th>비추천</Table.Th>
                    <Table.Th>작성자</Table.Th>
                    <Table.Th>작성일</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </ScrollArea>
        </div>
      </Paper>
    </div>
  );
}
