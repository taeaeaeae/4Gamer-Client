import { useEffect, useState } from "react";
import {
    createChannel,
    getChannels,
    updateChannel,
    deleteChannel
} from "../../api/channelApi";
import ChannelList from "./channelitem";
import { Channel } from "./channelitem"

// Todo 인터페이스 정의
interface ChannelData {
    id: number;
    title: string;
    gameTitle: string;
    introduction: string;
    alias: string;
}

const ChannelContainer = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const fetchChannels = async () => {
        const data = await getChannels();
        setChannels(data);
    };

    const removeChannel = async (id: number) => {
        await deleteChannel(id);
        await fetchChannels();
        alert("Channel 삭제 완료!");
    };

    // const updateChannel = async (channel: ChannelData) => {
    //     await updateChannel(channel);
    //     await fetchChannels();
    //     alert("Channel 수정 완료!");
    // };

    useEffect(() => {
        fetchChannels();
    }, []);

    return (
        <div>
            <ChannelList
                fetchChannels={fetchChannels}
            />
        </div>
    );
};

export default ChannelContainer;