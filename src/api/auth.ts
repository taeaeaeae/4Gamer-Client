import { client } from "./client";

export const signup = async (email: string, password: string, nickname: string) => {
  const response = await client.post(`/api/v1/auth/signup`, {
    email,
    password,
    nickname,
  });

  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await client.post(`/api/v1/auth/signin`, {
    email,
    password,
  });

  return response.data;
};


export const googleLogin = async () => {
  const response = await client.post(`/api/v1/auth/signin/google`);

  return response.data;
};