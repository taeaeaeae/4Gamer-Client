import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Avatar, 
  Paper, 
  Text, 
  Button, 
  TextInput, 
  PasswordInput,
  Loader,
  Modal
} from '@mantine/core';
import { 
  getMemberInfo, 
  updateNickname, 
  updatePassword, 
  updatePasswordCheck 
} from '../api/member';
import classes from '../components/css/Member.module.css';

export function MemberContainer() {
  const [userData, setUserData] = useState<any>({});
  const [nickname, setNickname] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [currentPasswordForNickname, setCurrentPasswordForNickname] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<{ nickname: boolean, password: boolean }>({
    nickname: false,
    password: false
  });
  const [loading, setLoading] = useState<boolean>(false);
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

        setNickname(userInfo.nickname);

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

  const handleNicknameChange = async () => {
    if (!currentPasswordForNickname) {
      alert('현재 비밀번호를 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const passwordCheckResponse = await updatePasswordCheck(currentPasswordForNickname);
      
      if (passwordCheckResponse && Object.keys(passwordCheckResponse).length === 0) {
        await updateNickname(nickname);
        alert('닉네임이 변경되었습니다.');
        setModalOpen(prev => ({ ...prev, nickname: false }));
        window.location.reload();
      } else {
        alert('현재 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('닉네임 변경 중 오류 발생:', error);
      alert('닉네임 변경이 실패하였습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      const passwordCheckResponse = await updatePasswordCheck(currentPassword);
      
      if (passwordCheckResponse && Object.keys(passwordCheckResponse).length === 0) {
        await updatePassword(newPassword);
        alert('비밀번호가 변경되었습니다.');
        setModalOpen(prev => ({ ...prev, password: false }));
        window.location.reload();
      } else {
        alert('현재 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 중 오류 발생:', error);
      alert('비밀번호 변경이 실패하였습니다.');
    } finally {
      setLoading(false);
    }
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
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button onClick={() => setModalOpen(prev => ({ ...prev, nickname: true }))} color="blue" style={{ flex: 1 }}>
                닉네임 변경
              </Button>
              <Button onClick={() => setModalOpen(prev => ({ ...prev, password: true }))} color="blue" style={{ flex: 1 }}>
                비밀번호 변경
              </Button>
              <Button onClick={handleLogout} color="red" style={{ flex: 1 }}>
                로그아웃
              </Button>
            </div>
          </Card>
        </div>
      </Paper>

      <Modal
        opened={modalOpen.nickname}
        onClose={() => setModalOpen(prev => ({ ...prev, nickname: false }))}
        title="닉네임 변경"
        size="lg"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput 
            label="현재 비밀번호" 
            type="password" 
            value={currentPasswordForNickname} 
            onChange={(e) => setCurrentPasswordForNickname(e.target.value)} 
          />
          <TextInput 
            label="변경할 닉네임" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
          />
          <Button onClick={handleNicknameChange} disabled={loading} size="lg" style={{ height: '40px' }}>
            {loading ? <Loader size="xs" /> : '닉네임 변경'}
          </Button>
        </div>
      </Modal>

      <Modal
        opened={modalOpen.password}
        onClose={() => setModalOpen(prev => ({ ...prev, password: false }))}
        title="비밀번호 변경"
        size="lg"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput 
            label="현재 비밀번호" 
            type="password" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
          />
          <PasswordInput 
            label="새 비밀번호" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <PasswordInput 
            label="비밀번호 확인" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          <Button onClick={handlePasswordChange} color="blue" disabled={loading} size="lg" style={{ height: '40px' }}>
            {loading ? <Loader size="xs" /> : '비밀번호 변경'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
