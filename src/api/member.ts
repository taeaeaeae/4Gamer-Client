import { client } from "./client";

export const getMemberInfo = async (accessToken: string) => {
  const { data } = await client.get(`/api/v1/member`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { id, email, nickname, role} = data;
  return { success: true, id, email, nickname, role };
};

export const getPostList = async () => {
    const response = await client.get(`/api/v1/member/posts`);
    return response.data;
};

export const addMessage = async(targetId: string, message: string) => {
    const response = await client.post(`/api/v1/member/message?target-id=${targetId}`,{
        message,
      }
    )
    return response.data
};

export const addBlackList = async (targetId: string) => {
  try {
    const response = await client.post(`/api/v1/member/blacklist?target-id=${targetId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to add to blacklist:', error);
    throw error;
  }
};

export const removeBlackList = async (targetId: string) => {
  try {
    const response = await client.delete(`/api/v1/member/blacklist?target-id=${targetId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to remove from blacklist:', error);
    throw error;
  }
};

// export const getBlacklist = async () => {
//  const response = await memberClient.get(`/api/v1/member/blacklist`);
//  return response.data;
// };

export const logoutUser = () => {
    localStorage.removeItem("accessToken");
};