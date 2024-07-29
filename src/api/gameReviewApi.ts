import { fromourGameClient } from './FourGameClient';

export const getGameReviewList = async (page: number, size: number) => {
  const response = await fromourGameClient.get(`/api/v1/game-reviews?page=${page}&size=${size}`);

  return response.data;
};
