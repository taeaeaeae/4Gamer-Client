import { client } from './client';

export const getGameReviewReactionList = async () => {
  const response = await client.get('/api/v1/member/reactions');

  return response.data;
};

export const updateGameReviewReaction = async (gameReviewId: number, isUpvoting: boolean) => {
  const response = await client.put(
    `/api/v1/game-reviews/${gameReviewId}/reaction?is-upvoting=${isUpvoting}`
  );

  return response.data;
};

export const deleteGameReviewReaction = async (gameReviewId: number) => {
  const response = await client.delete(`/api/v1/game-reviews/${gameReviewId}/reaction`);

  return response.data;
};
