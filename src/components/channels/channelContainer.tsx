import { useEffect, useState } from "react";
import {
  createChannel,
  deleteChannel,
  getChannelItem,
  getChannels,
  updateChannel,
} from "../../api/channelApi";
import { Channel } from "./channelitem";
import ChannelInput from "./channelInput";
import ChannelList from "./channelList";

const ChannelContainer = () => {
  const [channel, setChannels] = useState([]);

  const fetchChannels = async () => {
    const data = await getChannels();

    setChannels(data);
  };

  const addChannel = async (channel: Channel) => {
    await createChannel(channel);

    await fetchChannels();

    alert("Channel 추가 완료!");
  };

  const removeChannel = async (id: BigInt) => {
    await deleteChannel(id);

    await fetchChannels();

    alert("Channel 삭제 완료!");
  };

  const toggleChannel = async (channel: any) => {
    await updateChannel(channel);

    await fetchChannels();

    alert("Channel 수정 완료!");
  };

  const getChannelDetail = async (id: number) => {
    const data = await getChannelItem(id);

    alert(`Channel 상세 정보: ${JSON.stringify(data)}`);
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <div>
      <ChannelInput addChannel={addChannel} />
      <ChannelList
        Channels={Channels}
        removeChannel={removeChannel}
        toggleChannel={toggleChannel}
        getChannelDetail={getChannelDetail}
      />
    </div>
  );
};

export default ChannelContainer;