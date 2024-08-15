import { client } from './client';

export const addComment = async (
    channelId: bigint,
    boardId: bigint,
    postId: bigint,
    comment: any
) => {
    const response = await client.post(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/comments`, comment);
    return response.data;
};

export const updateComment = async (
    channelId: bigint,
    boardId: bigint,
    postId: bigint,
    commentId: bigint,
    newComment: any
) => {
    const response = await client.put(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/comments/${commentId}`, newComment);
    return response.data;
};

export const deleteComment = async (
    channelId: bigint,
    boardId: bigint,
    postId: bigint,
    commentId: bigint
) => {
    await client.delete(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/comments/${commentId}`);
};
