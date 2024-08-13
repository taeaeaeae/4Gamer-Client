import { client } from './client';

export const searchGameTitle = async (gameTitle: string) => {
  const response = await client.post(`/api/v1/igdb/get-name?gameTitle=${gameTitle}`);

  return response.data;
};

export const getGameTop10 = async (): Promise<GameResponse> => {
  const response = await client.post(`/api/v1/igdb/top-games`);
  
  return response.data as GameResponse;
};

export interface Game {
  id: number;
  name: string;
  total_rating: number;
  total_rating_count: number;
}

export interface GameResponse {
  body: string;
}