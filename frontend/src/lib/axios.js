import axios from 'axios';

// Configure axios with base URL and credentials
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : 'https://chat-backend-ty35.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});