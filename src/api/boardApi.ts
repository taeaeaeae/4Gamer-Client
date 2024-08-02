import { client } from "./client";

export const getBoards = async (channelId: any) => {
    const response = await client.get(`/api/v1/channels/${channelId}/boards`);

    return response.data;
};

export const createboard = async (channelId: any, request: request) => {
    const response = await client.post(`/api/v1/channel-admin/channels/${channelId}/boards`, request);

    return response.data;
};

export const removeBoards = async (channelId: any, id: any) => {
    const response = await client.delete(`/api/v1/channel-admin/channels/${channelId}/boards/${id}`);

    return response.data;
};

export const updateBoards = async (channelId: any, id: any) => {
    const response = await client.put(`/api/v1/channel-admin/channels/${channelId}/boards/${id}`);

    return response.data;
};

export interface request {
    title: string;
    introduction: string;
}