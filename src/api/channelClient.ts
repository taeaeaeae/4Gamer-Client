import axios from "axios";

export const channelClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
});

channelClient.interceptors.request.use((config) => {
    console.log("config :>> ", config);
    return config
});

channelClient.interceptors.response.use((response) => {
    console.log("response :>> ", response);
    return response
});


// export function getAuthHeaders(): { headers: { Authorization: string } } | undefined {
//     const token = localStorage.getItem('jwtToken');
//     if (token) {
//         return {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         };
//     }
//     return undefined;
// }

// export async function fetchProtectedData(): Promise<any> {
//     try {
//         const config = getAuthHeaders();
//         // const response = await axios.get('/api/v1/auth/signin/google', config);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching protected data:', error);
//         throw error;
//     }
// }
