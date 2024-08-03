import classes from '../components/css/Member.module.css';
import { 
  Card, 
  Avatar, 
  Paper, 
  Text, 
  Button, 
  Group, 
  Stack, 
  TextInput } from '@mantine/core';
import { 
  useState, 
  useEffect } from 'react';
import { 
  addBlackList,
   removeBlackList, 
   getMemberInfo } from '../api/member';

export function BlackListContainer() {
  const [blacklistData, setBlacklistData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>({});
  const [blacklistTarget, setBlacklistTarget] = useState<string>('');

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

  const handleAddBlacklist = async () => {
      try {
        await addBlackList(blacklistTarget);
        setBlacklistData([...blacklistData, { id: blacklistTarget }]);
        setBlacklistTarget(''); 
        alert('차단에 성공하였습니다.');
      } catch (error) {
        console.error('Error adding to blacklist:', error);
        alert('차단에 실패하였습니다.');
      }
  };
  
  const handleRemoveBlacklist = async (targetId: string) => {
      try {
        await removeBlackList(targetId);
        setBlacklistData(blacklistData.filter(item => item.id !== targetId));
        alert('차단 해체에 성공하였습니다.');
      } catch (error) {
        console.error('Error removing from blacklist:', error);
        alert('차단 해제에 실패하였습니다.');
      }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
      <Paper shadow="md" radius="lg" style={{ width: 1100, maxWidth: '100%', padding: '1rem' }}>
        <Text fz="xl" fw={700} mb="md">
          블랙리스트
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
          <Stack justify="space-between" style={{ flexGrow: 1 }}>
            <TextInput
              value={blacklistTarget}
              onChange={(e) => setBlacklistTarget(e.target.value)}
              placeholder="블랙리스트에 추가할 ID 입력"
              style={{ marginBottom: '1rem' }}
            />
            <div>
              {blacklistData.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Text>{item.id}</Text>
                  <Button onClick={() => handleRemoveBlacklist(item.id)} color="red">제거</Button>
                </div>
              ))}
            </div>
            <Group justify="right">
              <Button onClick={handleAddBlacklist} color="green">블랙리스트 추가</Button>
              <Button onClick={() => handleRemoveBlacklist(blacklistTarget)} color="red">블랙리스트 제거</Button>
            </Group>
          </Stack>
        </div>
      </Paper>
    </div>
  );
}
