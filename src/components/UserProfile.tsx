import React, { useEffect, useState } from 'react';
import { v7 as uuid } from 'uuid';
import { Button, HoverCard, Text, UnstyledButton, Group, Stack } from '@mantine/core';
import styles from './css/UserProfile.module.css';
import { getMemberDetails, getMemberInfo } from '@/api/member';
import { isConnectedMember } from '@/api/chat';
import Chat from './chat/Chat';

interface UserProfileProps {
  children: React.ReactElement;
  memberId: string;
}

interface UserData {
  id: string;
  name: string;
}

const UserProfile: React.FC<UserProfileProps> = (props) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openChatWindow, setOpenChatWindow] = useState(false);
  const [readyToChat, setReadyToChat] = useState(true);
  const [subjectId, setSubjectId] = useState('');
  const roomId = uuid();

  const handleChatWindow = (value: boolean) => {
    setOpenChatWindow(value);
  };

  const checkConnection = async () => {
    const isOk = await isConnectedMember(props.memberId);

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
      if (!props.memberId) {
        setError('Member ID가 제공되지 않았습니다.');
        return;
      }

      try {
        const userInfo = await getMemberDetails(props.memberId);

        setUserData({
          id: userInfo.id!,
          name: userInfo.nickname!,
        });
      } catch (e) {
        console.error('데이터를 가져오는 중 오류 발생:', e);
        setError('데이터를 가져오는 중 오류 발생');
      }
    };

    fetchUserData();
    checkConnection();
  }, [props.memberId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    // <Group justify="center">
    <>
      <HoverCard width={360} shadow="md">
        <HoverCard.Target>
          <UnstyledButton>{props.children}</UnstyledButton>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {/* <div className={styles['profile-info']} style={{ padding: '1rem' }}> */}
          <Stack>
            <Text>
              <strong>id:</strong> {userData.id}
            </Text>
            <Text>
              <strong>닉네임:</strong> {userData.name}
            </Text>
            {subjectId !== props.memberId
              ? (
                <Button
                  type="button"
                  onClick={() => setOpenChatWindow(true)}
                  style={{ marginTop: '1rem', marginLeft: 'auto', display: 'block' }}
                >
                  채팅하기
                </Button>
              )
              : <></>
            }
          </Stack>
          {/* </div> */}
        </HoverCard.Dropdown>
      </HoverCard>
      {readyToChat && openChatWindow && (
        <Group pos="absolute" top={100}>
          <Chat
            subjectId={subjectId}
            targetId={props.memberId}
            roomId={roomId}
            handler={handleChatWindow}
          />
        </Group>
      )}
    </>
  );
};

export default UserProfile;
