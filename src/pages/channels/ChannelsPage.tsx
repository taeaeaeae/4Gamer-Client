import { useEffect, useRef, useState } from 'react';
import { getChannels } from '../../api/channelApi';
import ChannelItem from '@/components/channels/Channelitem';

const ChannelList = () => {
    const [channelList, setChannelList] = useState<ChannelListInfo[]>([]);
    const ref = useRef<HTMLDivElement | null>(null);

    const fetchChannelList = async () => {
        const data = await getChannels();
        setChannelList(data.content);
    };

    useEffect(() => {
        fetchChannelList();
    }, []); // 빈 배열을 의존성 배열로 전달하여 컴포넌트가 마운트될 때만 실행되도록 함

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {channelList.map((value: ChannelListInfo) => (
                <div key={value.id}>
                    <ChannelItem
                        id={value.id}
                        title={value.title}
                        gameTitle={value.gameTitle}
                        introduction={value.introduction}
                        alias={value.alias}
                        createdAt={value.createdAt}
                        updatedAt={value.updatedAt}
                    />
                </div>
            ))}
            <div ref={ref}></div>
        </div>
    );
};

export default ChannelList;

interface ChannelListInfo {
    id: number;
    title: string;
    gameTitle: string;
    introduction: string;
    alias: string;
    createdAt: string;
    updatedAt: string;
}
