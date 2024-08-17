import { client } from './client';

export const getChannels = async () => {
    const response = await client.get('/api/v1/channels');

    return response.data;
};

export const getChannelItem = async (channelId: any) => {
    const response = await client.get(`/api/v1/channels/${channelId}`);

    return response.data;
};

export const createChannel = async (request: request) => {
    const response = await client.post('/api/v1/channels', request);

    return response.data;
};

export const updateChannel = async (channelId: any, request: update) => {
    const response = await client.put(`/api/v1/channel-admin/channels/${channelId}`, request);

    return response.data;
};

export const deleteChannel = async (channelId: any) => {
    const response = await client.delete(`/api/v1/channel-admin/channels/${channelId}`);

    return response.data;
};

export const searchGameTitle = async (gameTitle: any) => {
    const response = await client.post(`/api/v1/igdb/get-name?gameTitle=${gameTitle}`);

    return response.data;
};

export const topPost = async (channelId: any) => {
    const response = await client.get(`/api/v1/channels/${channelId}/top-posts`);

    return response.data;
};

export const getTopPostList = async (channelId: number) => {
    const response = await client.get(`/api/v1/channels/${channelId}/top-posts`);

    return response.data;
};

export const addBlackList = async (channelId: string, memberId: string) => {
    try {
        const response = await client.post(`/api/v1/channel-admin/channels/${channelId}/blacklist?memberId=${memberId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to add to blacklist:', error);
        throw error;
    }
};

export const removeBlackList = async (channelId: string, memberId: string) => {
    try {
        const response = await client.delete(`/api/v1/channel-admin/channels/${channelId}/blacklist?memberId=${memberId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to remove from blacklist:', error);
        throw error;
    }
};

export const getBlacklist = async (channelId: string) => {
    const response = await client.get(`/api/v1/channel-admin/channels/${channelId}/blacklists`);
    return response.data;
};

export interface request {
    title: String;
    gameTitle: String;
    introduction: String;
    alias: String;
}

export interface update {
    title: String;
    introduction: String;
}

export interface SearchGameTitle {
    id: number;
    name: string;
}
