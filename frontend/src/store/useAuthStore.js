import { create } from 'zustand';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import config from '../lib/config';

export const useAuthStore = create((set, get) => ({
  // State
  authUser: null,
  isSigningIn: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUser: [],
  socket: null,

  // Check if user is already authenticated (on app load)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Register new user
  signup: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Signup successful!');
      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Signup failed. Please try again.');
    } finally {
      set({ isSigningIn: false });
    }
  },

  // Login existing user
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Login successful!');
      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout user
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully.');
      get().disconnectSocket();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Logout failed.');
    }
  },

  // Update user profile picture
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: res.data });
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Profile update failed.');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Connect to WebSocket server
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(config.SOCKET_URL, {
      query: { userId: authUser._id },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      set({ socket });
      // Subscribe to all messages for notification purposes
      import('./usechatstore').then(({ useChatStore }) => {
        useChatStore.getState().subscribetoAllMessages();
      });
    });

    socket.on('get-online-users', (userIds) => {
      set({ onlineUser: userIds });
    });
  },

  // Disconnect from WebSocket server
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));