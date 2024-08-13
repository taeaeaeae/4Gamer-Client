import { client } from './client';

export const getGameReviewList = async (page: number, size: number) => {
  const response = await client.get(`/api/v1/game-reviews?page=${page}&size=${size}`);

  return response.data;
};

export const getGameReview = async (gameReviewId: string = '') => {
  const response = await client.get(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};

export const updateGameReview = async (gameReviewId: string, gameReview: UpdateGameReview) => {
  const response = await client.put(`/api/v1/game-reviews/${gameReviewId}`, gameReview);

  return response.data;
};

export const deleteGameReview = async (gameReviewId: string) => {
  const response = await client.delete(`/api/v1/game-reviews/${gameReviewId}`);

  return response.data;
};

export const createGameReview = async (gameReview: CreateGameReview) => {
  const response = await client.post('/api/v1/game-reviews', gameReview);

  return response.data;
};

interface CreateGameReview {
  gameTitle: string;
  point: string;
  description: string;
}

interface UpdateGameReview {
  point: string;
  description: string;
}