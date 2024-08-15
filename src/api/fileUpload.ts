import { client } from './client';

export const getPresignedUrl = async (filename: string) => {
  // const response = await client.get(`/api/v1/s3/presigned?file=${filename}`);
  const response = await client.get(`/api/v1/s3/presigned?file=${filename}`);
  return response.data;
};

export const getImages = async (attachmentPrefix: string) => {
  const response = await client.get(`/api/v1/s3/list/${attachmentPrefix}`);
  return response.data;
};

export const deleteImage = async (filename: string) => {
  await client.delete(`/api/v1/s3/images?file=${filename}`);
};
