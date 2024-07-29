import axios from "axios";

export const channelClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Access-Control-Allow-Origin": "*", // CORS
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