import { fourGamerClient } from './FourGamerClient';

export const getGameReviewList = async (page: number, size: number) => {
  const response = await fourGamerClient.get(`/api/v1/game-reviews?page=${page}&size=${size}`);

  return response.data;
};

export const getGameReview = async (gameReviewId: string = '') => {
  const response = await fourGamerClient.get(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};

export const updateGameReview = async (gameReviewId: string, gameReview: GameReview) => {
  const response = await fourGamerClient.put(`/api/v1/game-reviews/${gameReviewId}`, gameReview);

  return response.data;
};

export const deleteGameReview = async (gameReviewId: string) => {
  const response = await fourGamerClient.delete(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};

export const createGameReview = async (gameReview: GameReview) => {
  const response = await fourGamerClient.post('/api/v1/game-reviews', gameReview);

  return response.data;
};

interface GameReview {
  gameTitle: string;
  point: string;
  description: string;
}
