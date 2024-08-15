// ChannelDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChannelItem } from '../../api/channelApi'; // 채널 데이터를 가져오는 API 함수
import { Channel } from '../../components/channels/channelitem';

const ChannelDetailPage = () => {
    const { channelId } = useParams<{ channelId: string }>();
    const [channel, setChannel] = useState<Channel | null>(null);

    useEffect(() => {
        const fetchChannel = async () => {
            if (channelId) {
                const data = await getChannelItem(parseInt(channelId, 10));
                setChannel(data);
            }
        };
        fetchChannel();
    }, [channelId]);

    if (!channel) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{channel.title}</h1>
            <p>{channel.introduction}</p>
        </div>
    );
};

export default ChannelDetailPage;
