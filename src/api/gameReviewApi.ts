import { fromourGamerClient } from './FourGamerClient';

export const getGameReviewList = async (page: number, size: number) => {
  const response = await fromourGamerClient.get(`/api/v1/game-reviews?page=${page}&size=${size}`);

  return response.data;
};

export const getGameReview = async (gameReviewId: string = '') => {
  const response = await fromourGamerClient.get(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};

export const updateGameReview = async (gameReviewId: string) => {
  const response = await fromourGamerClient.put(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};

export const deleteGameReview = async (gameReviewId: string) => {
  const response = await fromourGamerClient.delete(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};
