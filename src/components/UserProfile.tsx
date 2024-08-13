import React, { useEffect, useState } from 'react';
import { HoverCard, Text, Button, Group } from '@mantine/core';
import styles from './css/UserProfile.module.css';
import { getMemberDetails, getMemberInfo } from '@/api/member';
import { isConnectedMember } from '@/api/chat';
import Chat from './chat/Chat';

interface UserProfileProps {
  memberId: string;
}

interface UserData {
  id: string;
  name: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ memberId }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openChatWindow, setOpenChatWindow] = useState(false);
  const [readyToChat, setReadyToChat] = useState(true);
  const [subjectId, setSubjectId] = useState('');
  const roomId = crypto.randomUUID();

  const handleChatWindow = (value: boolean) => {
    setOpenChatWindow(value);
  };

  const checkConnection = async () => {
    const isOk = await isConnectedMember(memberId);

    if (isOk) {
      const token = localStorage.getItem('accessToken');

      if (token) {
        const data = await getMemberInfo(token);
        setSubjectId(data.id);
      }
    }

    setReadyToChat(isOk);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!memberId) {
        setError('Member ID가 제공되지 않았습니다.');
        return;
      }

      try {
        const userInfo = await getMemberDetails(memberId);

        setUserData({
          id: userInfo.id!,
          name: userInfo.nickname!,
        });
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        setError('데이터를 가져오는 중 오류 발생');
      }
    };

    fetchUserData();
    checkConnection();
  }, [memberId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Group justify="center">
      <HoverCard width={350} shadow="md">
        <HoverCard.Target>
          <Button> {/* 호버 타겟이 될 곳 */} </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <div className={styles['profile-info']} style={{ padding: '1rem' }}>
            <Text>
              <strong>id:</strong> {userData.id}
            </Text>
            <Text>
              <strong>닉네임:</strong> {userData.name}
            </Text>
            <button
              type="button"
              onClick={() => setOpenChatWindow(true)}
              style={{ marginTop: '1rem', marginLeft: 'auto', display: 'block' }}
            >
              채팅하기
            </button>
          </div>
        </HoverCard.Dropdown>
      </HoverCard>
      {readyToChat && openChatWindow && (
        <Group pos="absolute" top={100}>
          <Chat
            subjectId={subjectId}
            targetId={memberId}
            roomId={roomId}
            handler={handleChatWindow}
          />
        </Group>
      )}
    </Group>
  );
};

export default UserProfile;
