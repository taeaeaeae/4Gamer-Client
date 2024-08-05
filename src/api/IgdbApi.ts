import { client } from './client';

export const searchGameTitle = async (gameTitle: string) => {
  const response = await client.post(`/api/v1/igdb/get-name?gameTitle=${gameTitle}`);

  return response.data;
};
