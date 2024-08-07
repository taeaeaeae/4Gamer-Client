import axios from "axios";
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});