import { client } from './client';

export const searchGameTitle = async (gameTitle: string) => {
  const response = await client.post(`/api/v1/igdb/get-name?gameTitle=${gameTitle}`);

  return response.data;
};

export const getGameTop10 = async (): Promise<GameResponse> => {
  const response = await client.post(`/api/v1/igdb/top-games`);

  return response.data as GameResponse;
};

export const getFollowGameTop10 = async (): Promise<GameCResponse> => {
  const response = await client.post(`/api/v1/igdb/top-follow`);
  
  return response.data as GameCResponse;
};

export interface Game {
  id: number;
  name: string;
  total_rating: number;
  total_rating_count: number;
}

export interface GameC {
  id: number;
  name: string;
  hypes: number;
}

export interface GameResponse {
  body: string;
}

export interface GameCResponse {
  body: string;
}