import { useEffect, useState } from "react";
import {
    createChannel,
    getChannels,
    updateChannel,
    deleteChannel
} from "../../api/channelApi";
import ChannelList from "./Channelitem";
import { Channel } from "./Channelitem"

// Todo 인터페이스 정의
interface ChannelData {
    id: number;
    title: string;
    gameTitle: string;
    introduction: string;
    alias: string;
}

const ChannelContainer = () => {
    const [channels, setChannels] = useState<Channel[]>([]); // 상태 변수에 대한 타입 명시

    // Channels를 가져오는 함수
    const fetchChannels = async () => {
        const data = await getChannels();
        setChannels(data);
    };

    // 새로운 Channel을 추가하는 함수
    const addChannel = async (channel: ChannelData) => {
        await createChannel(channel);
        await fetchChannels();
        alert("Channel 추가 완료!");
    };

    // Channel을 삭제하는 함수
    const removeChannel = async (id: number) => {
        await deleteChannel(id);
        await fetchChannels();
        alert("Channel 삭제 완료!");
    };

    const updateChannel = async (channel: ChannelData) => {
        await updateChannel(channel);
        await fetchChannels();
        alert("Channel 수정 완료!");
    };

    // 컴포넌트가 마운트될 때 Channels를 가져오는 함수 호출
    useEffect(() => {
        fetchChannels();
    }, []);

    return (
        <div>
            {/* <ChannelInput addChannel /> */}
            <ChannelList
                fetchChannels={fetchChannels}
                channels={channels}
                removeChannel={removeChannel}
            //   updateChannel={updateChannel} // 사용되지 않는 부분 주석 처리
            // getChannelDetail={getChannelDetail} // 사용되지 않는 부분 주석 처리
            />
        </div>
    );
};

export default ChannelContainer;