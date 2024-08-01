import { fourGamerClient } from './FourGamerClient';

export const getGameReviewReactionList = async () => {
  const response = await fourGamerClient.get('/api/v1/member/reactions');

  return response.data;
};

export const updateGameReviewReaction = async (gameReviewId: number, isUpvoting: boolean) => {
  const response = await fourGamerClient.put(
    `/api/v1/game-reviews/${gameReviewId}/reaction?is-upvoting=${isUpvoting}`
  );

  return response.data;
};

export const deleteGameReviewReaction = async (gameReviewId: number) => {
  const response = await fourGamerClient.delete(`/api/v1/game-reviews/${gameReviewId}/reaction`);

  return response.data;
};
