import { client } from "./client";

export const getBoards = async (channelId: number) => {
    const response = await client.get(`/api/v1/channels/${channelId}/boards`);

    return response.data;
};