import { channelClient } from "./channelClient";

export const getChannels = async () => {
    const response = await channelClient.get("/api/v1/channels");

    return response.data;
};

export const getChannelItem = async (id: number) => {
    const response = await channelClient.get(`/api/v1/channels/${id}`);

    return response.data;
};

export const createChannel = async (request: request) => {
    const response = await channelClient.post("/api/v1/channels", request);

    return response.data;
};

export const updateChannel = async (id: number, request: request) => {
    const response = await channelClient.put(`/api/v1/channels/${id}`, request);

    return response.data;
};

export const deleteChannel = async (id: number) => {
    const response = await channelClient.delete(`/api/v1/channels/${id}`);

    return response.data;
};

export interface request {
    title: String;
    gameTitle: String;
    introduction: String;
    alias: String;
}
