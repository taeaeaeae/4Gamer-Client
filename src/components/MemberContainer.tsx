import classes from '../components/css/Member.module.css';
import { useState, useEffect } from 'react';
import { getMemberInfo } from '../api/member';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Avatar, 
  Paper, 
  Text, 
  Button, 
  Group } from '@mantine/core';

export function MemberContainer() {
  const [userData, setUserData] = useState<any>({});
  const navigate = useNavigate();
  const client = { 
    deactivate: () => console.log("WebSocket client deactivated")
  };

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

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  const preventClose = (e: { preventDefault: () => void; returnValue: string; }) => {
    e.preventDefault();
    e.returnValue = '';
  };

  const webSocketDisconnection = () => {
    console.log("Disconnected");
    client.deactivate(); 
    window.removeEventListener("beforeunload", preventClose);
  };

  const handleLogout = async () => {
    webSocketDisconnection();
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
      <Paper shadow="md" radius="lg" style={{ width: 1100, maxWidth: '100%', padding: '1rem' }}>
        <Text fz="xl" fw={700} mb="md">
          상세 정보
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
          <Card withBorder padding="xl" radius="md" className={classes.card} style={{ flexGrow: 1, height: '325px' }}>
            <Text fz="h3" fw={600}><strong>내 정보</strong></Text>
            <br />
            <Text><strong>고유 ID : </strong> {userData.id}</Text>
            <br />
            <Text><strong>이메일 : </strong> {userData.email}</Text>
            <br />
            <Text><strong>닉네임 : </strong> {userData.name}</Text>
            <br />
            <Group justify="right">
              <Button onClick={handleLogout} color="red">로그아웃</Button>
            </Group>
          </Card>
        </div>
      </Paper>
    </div>
  );
}
