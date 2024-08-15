import { client } from './client';

export const createPost = async (channelId: bigint, boardId: bigint, post: any) => {
    const response = await client.post(`/api/v1/channels/${channelId}/boards/${boardId}/posts`, post);
    return response.data;
};

export const getPosts = async (channelId: bigint, boardId: bigint, page: bigint, size: bigint) => {
    const response = await client.get(`/api/v1/channels/${channelId}/boards/${boardId}/posts?page=${page}&size=${size}`);
    return response.data;
};

export const getPost = async (channelId: bigint, boardId: bigint, postId: bigint) => {
    const response = await client.get(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}`);
    return response.data;
};

export const updatePost = async (channelId: bigint, boardId: bigint, postId: bigint, newPost: any) => {
    const response = await client.put(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}`, newPost);
    return response.data;
};

export const deletePost = async (channelId: bigint, boardId: bigint, postId: bigint) => {
    const response = await client.delete(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}`);
    return response.data;
};

export const getTagsInPost = async (channelId: bigint, boardId: bigint, postId: bigint) => {
    const response = await client.get(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/tags`);
    return response.data;
};

export const getComments = async (channelId: bigint, boardId: bigint, postId: bigint, page: bigint, size: bigint) => {
    const response = await client.get(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/comments?page=${page}&size=${size}`);
    return response.data;
};

export const addComment = async (channelId: bigint,
    boardId: bigint,
    postId: bigint,
    comment: any
) => {
    const response = await client.post(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/comments`, comment);
    return response.data;
};

export const addPostReaction = async (
    channelId: bigint,
    boardId: bigint,
    postId: bigint,
    isUpvoting: boolean
) => {
    const response = await client.put(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/reaction?is-upvoting=${isUpvoting}`);
    return response.data;
};

export const deletePostReaction = async (
    channelId: bigint,
    boardId: bigint,
    postId: bigint
) => {
    const response = await client.delete(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/reaction`);
    return response.data;
};

export const addCommentReaction = async (
    channelId: bigint,
    boardId: bigint,
    postId: bigint,
    commentId: bigint,
    isUpvoting: boolean
) => {
    const response = await client.put(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/comments/${commentId}/reaction?is-upvoting=${isUpvoting}`);
    return response.data;
};

export const deleteCommentReaction = async (
    channelId: bigint,
    boardId: bigint,
    postId: bigint,
    commentId: bigint
) => {
    const response = await client.delete(`/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/comments/${commentId}/reaction`);
    return response.data;
};
