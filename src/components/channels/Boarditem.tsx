import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getBoards } from '../../api/boardApi';
import { useIsRobot } from '@/api/captchaApi';

const ChannelList = ({ fetchChannels }: ChannelListProps) => {
    const [channelList, setChannelList] = useState<Channel[]>([]);
    const ref = useRef<HTMLDivElement | null>(null);

    const { checkIsRobot } = useIsRobot();
    const navigate = useNavigate();

    const handleCreateClick = async () => {
        try {
            // 로봇여부체크
            const result = await checkIsRobot();
            if (result.score < 0.8) {
                throw new Error('사람이 아님')
            }
            // 검증됐을 때 할 행동
            navigate(`/channels/new`);
        } catch (error) {
            console.error("Failed to check robot status:", error);
        }
    };

    const fetchBoardlList = async () => {
        const data = await getBoards(id);
        setChannelList(data.content);
    };

    useEffect(() => {
        fetchBoardlList();
    }, []);

}

interface Board {
    id: number;
    tiitle: string;
    updatedAt: Date;
}