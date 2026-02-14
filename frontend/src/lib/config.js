// Backend API Configuration
// Change these URLs based on your deployment environment

const config = {
  // Backend API base URL (without /api suffix)
  BACKEND_URL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:4000' 
    : 'https://chat-backend-ty35.onrender.com',
  
  // Full API URL (with /api suffix)
  get API_URL() {
    return `${this.BACKEND_URL}/api`;
  },

  // Socket.IO URL (same as backend URL)
  get SOCKET_URL() {
    return this.BACKEND_URL;
  },
};

export default config;
