import { create } from 'zustand';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { API_URL } from '../config';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningIn: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUser: [],
  socket: null,

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

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(API_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      set({ socket });
      import('./usechatstore').then(({ useChatStore }) => {
        useChatStore.getState().subscribetoAllMessages();
      });
    });

    socket.on('get-online-users', (userIds) => {
      set({ onlineUser: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));