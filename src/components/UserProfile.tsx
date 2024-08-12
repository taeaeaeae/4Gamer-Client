import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMemberDetails } from '../api/member';
import styles from './css/UserProfile.module.css'

interface UserData {
  id: string;
  name: string;
}

const UserProfile: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>(); 
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setError('데이터를 가져오는 중 오류 발생');
      }
    };

    fetchUserData();
  }, [memberId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles['profile-container']}>
      <div className={styles['profile-info']}>
        <h4>ID: {userData.id}</h4>
        <p>Nickname: {userData.name}</p>
      </div>
    </div>
  );
};

export default UserProfile;
