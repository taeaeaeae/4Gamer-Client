import { fourGamerClient } from './FourGamerClient';

export const searchGameTitle = async (gameTitle: string) => {
  const response = await fourGamerClient.post(`/api/v1/igdb/get-name?gameTitle=${gameTitle}`);

  return response.data;
};
