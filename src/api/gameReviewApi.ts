import { fourGamerClient } from './FourGamerClient';

export const getGameReviewList = async (page: number, size: number) => {
  const response = await fourGamerClient.get(`/api/v1/game-reviews?page=${page}&size=${size}`);

  return response.data;
};

export const getGameReview = async (gameReviewId: string = '') => {
  const response = await fourGamerClient.get(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};

export const updateGameReview = async (gameReviewId: string) => {
  const response = await fourGamerClient.put(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};

export const deleteGameReview = async (gameReviewId: string) => {
  const response = await fourGamerClient.delete(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};
