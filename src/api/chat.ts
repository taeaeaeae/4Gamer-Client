import { client } from './client';

export const isConnectedMember = async (memberId: string) => {
  const response = await client.get(`/is-connecting/${memberId}`);

  return response.data;
};
