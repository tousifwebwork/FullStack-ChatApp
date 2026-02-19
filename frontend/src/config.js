// src/config.js
// Use localhost for development, Render URL for production
export const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:4000' 
  : 'https://chat-backend-ty35.onrender.com';
