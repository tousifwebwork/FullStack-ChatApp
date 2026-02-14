import axios from 'axios';
import config from './config';

// Configure axios with base URL and credentials
export const axiosInstance = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});