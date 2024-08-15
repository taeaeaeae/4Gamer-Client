import { client } from './client';

export const getPostReactionList = async () => {
  const response = await client.get('/api/v1/member/reactions/post');

  return response.data;
};

export const updatePostReaction =
async (channelId: bigint, boardId: bigint, postId: bigint,
  isUpvoting: boolean) => {
  const response = await client.put(
    `/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/reaction?is-upvoting=${isUpvoting}`
  );

  return response.data;
};

export const deletePostReaction =
async (channelId: bigint, boardId: bigint, postId: bigint) => {
  const response = await client.delete(
    `/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/reaction`
  );

  return response.data;
};

export const getCommentReactionList = async () => {
  const response = await client.get('/api/v1/member/reactions/comment');

  return response.data;
};

export const updateCommentReaction =
async (channelId: bigint, boardId: bigint, postId: bigint, commentId: bigint,
  isUpvoting: boolean) => {
  const response = await client.put(
    `/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/comments/${commentId}/reaction?is-upvoting=${isUpvoting}`
  );

  return response.data;
};

export const deleteCommentReaction =
async (channelId: bigint, boardId: bigint, postId: bigint, commentId: bigint) => {
  const response = await client.delete(
    `/api/v1/channels/${channelId}/boards/${boardId}/posts/${postId}/comments/${commentId}/reaction`
  );

  return response.data;
};
