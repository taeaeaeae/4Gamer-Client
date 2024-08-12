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

export const getMemberDetails = async (memberId: string) => {
    const { data } = await client.get(`/api/v1/members/${memberId}`);

    const { id, nickname} = data;
    return { id, nickname };
};

export const updateNickname = async (nickname: string) => {
  const { data } = await client.put(`/api/v1/members/profile`, 
    { nickname }, 
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
};

export const updatePassword = async (password: string) => {
  const { data } = await client.put(`/api/v1/members/password`, 
    { password }, 
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
};

export const updatePasswordCheck = async (password: string) => {
  const { data } = await client.post(`/api/v1/members/password-check`, 
    { password },
  );
  return data;
};

export const getPostList = async () => {
    const response = await client.get(`/api/v1/member/posts`);
    return response.data;
};

export const addMessage = async (targetId: string, message: string) => {
  const response = await client.post(
    `/api/v1/member/message?target-id=${targetId}`,
    message,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );

  return response.data;
};


export const getMessage = async () => {
  const { data } = await client.get('/api/v1/member/messages');
  
  return data;
}

export const logoutUser = () => {
    localStorage.removeItem("accessToken");
};

export interface MemberInfo {
  id: string;
  nickname: string;
}
