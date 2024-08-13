import classes from '../components/css/Member.module.css';
import {
  Paper,
  Text,
  Button,
  Group,
  TextInput,
  ScrollArea,
  Loader,
  Notification,
  Card
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useState,
  useEffect
} from 'react';
import {
  getMemberInfo
} from '../api/member';
import {
  addBlackList,
  removeBlackList,
  getBlacklist
} from '../api/channelApi';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  role: string;
}

interface BlacklistItem {
  memberId: string;
}

export function BlackListContainer() {
  const [blacklistData, setBlacklistData] = useState<BlacklistItem[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [blacklistTarget, setBlacklistTarget] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();

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
          nickname: userInfo.nickname,
          avatarUrl: '',
          role: userInfo.role
        });

      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setError('사용자 정보를 가져오는 중 오류 발생');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchBlacklistData = async () => {
      if (!channelId) return;

      try {
        setLoading(true);
        const data = await getBlacklist(channelId);
        if (Array.isArray(data)) {
          setBlacklistData(data);
          setHasMore(data.length > 0);
        } else {
          console.error("블랙리스트 데이터 형식이 잘못되었습니다.");
          setError('블랙리스트 데이터를 가져오는 중 오류 발생');
        }
      } catch (error) {
        console.error("블랙리스트 데이터를 가져오는 중 오류 발생:", error);
        setError('블랙리스트를 가져오는 중 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchBlacklistData();
  }, [channelId]);

  const handleAddBlacklist = async () => {
    if (!channelId || !blacklistTarget) {
      alert('채널 ID와 블랙리스트 ID를 입력해 주세요.');
      return;
    }

    const isAlreadyBlacklisted = blacklistData.some(item => item.memberId === blacklistTarget);
    if (isAlreadyBlacklisted) {
      alert('이 ID는 이미 블랙리스트에 있습니다.');
      return;
    }

    try {
      await addBlackList(channelId, blacklistTarget);
      setBlacklistData(prev => [...prev, { memberId: blacklistTarget }]);
      setBlacklistTarget('');
      alert('차단에 성공하였습니다.');
    } catch (error) {
      console.error('차단 추가 중 오류 발생:', error);
      alert('차단에 실패하였습니다.');
    }
  };

  const handleRemoveBlacklist = async (targetId: string) => {
    if (!channelId) {
      alert('채널 ID가 설정되지 않았습니다.');
      return;
    }

    try {
      await removeBlackList(channelId, targetId);
      setBlacklistData(prev => prev.filter(item => item.memberId !== targetId));
      alert('차단 해제에 성공하였습니다.');
    } catch (error) {
      console.error('차단 해제 중 오류 발생:', error);
      alert('차단 해제에 실패하였습니다.');
    }
  };

  const loadMoreData = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const data = await getBlacklist(channelId);

      if (Array.isArray(data)) {
        if (data.length > 0) {
          setBlacklistData(prevData => [...prevData, ...data]);

        } else {
          setHasMore(false);
        }
      } else {
        console.error("블랙리스트 데이터 형식이 잘못되었습니다.");
        setError('더 많은 블랙리스트를 가져오는 중 오류 발생');
        setHasMore(false);
      }
    } catch (error) {
      console.error("더 많은 블랙리스트 데이터를 가져오는 중 오류 발생:", error);
      setError('더 많은 블랙리스트를 가져오는 중 오류 발생');
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleClick = () => navigate(`/channels/${channelId}/admin`);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
      <Paper shadow="md" radius="lg" style={{ width: 1100, maxWidth: '100%', padding: '1rem' }}>
        <Group justify='space-between' m={10}>
          <Text fz="xl" fw={700} mb="md">
            블랙리스트
          </Text>
          <Button onClick={handleClick} m={10}>채널관리</Button>
        </Group>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <Card withBorder padding="xl" radius="md" className={classes.card} style={{ width: 1300, marginRight: '1rem' }}>
            <Card.Section h={140} style={{ backgroundImage: '' }} />
            <div style={{ flexGrow: 1 }}>
              <TextInput
                value={blacklistTarget}
                onChange={(e) => setBlacklistTarget(e.target.value)}
                placeholder="블랙리스트에 추가할 ID 입력"
                style={{ marginBottom: '1rem' }}
              />
              <Group justify="right" style={{ marginBottom: '1rem' }}>
                <Button onClick={handleAddBlacklist} color="green">블랙리스트 추가</Button>
              </Group>
              {loading && <Loader />}
              {error && <Notification color="red" title="Error">{error}</Notification>}
              <ScrollArea
                style={{ height: 300, overflowY: 'auto' }}
                onScroll={(event) => {
                  const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
                  if (scrollHeight - scrollTop <= clientHeight + 1) {
                    loadMoreData();
                  }
                }}
              >
                <div style={{ padding: '1rem' }}>
                  {blacklistData.length === 0 && !loading && <Text>블랙리스트가 없습니다.</Text>}
                  {blacklistData.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <Text>{item.memberId || 'ID 없음'}</Text>
                      <Button onClick={() => handleRemoveBlacklist(item.memberId)} color="red">제거</Button>
                    </div>
                  ))}
                  {loadingMore && <Text>Loading more...</Text>}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </div>
      </Paper>
    </div>
  );
}
