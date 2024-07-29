import axios from 'axios';

export const fromourGameClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*', // CORS
  },
});
