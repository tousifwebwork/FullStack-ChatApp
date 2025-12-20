import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  // State
  message: [],
  users: [],
  selecteduser: null,
  isusersloading: false,
  ismessagesloading: false,

  // Fetch all connected users (contacts)
  getuser: async () => {
    set({ isusersloading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      set({ users: res.data });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch users.');
    } finally {
      set({ isusersloading: false });
    }
  },

  // Fetch messages with a specific user
  getmessages: async (userId) => {
    set({ ismessagesloading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ message: res.data });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch messages.');
    } finally {
      set({ ismessagesloading: false });
    }
  },

  // Send a message to selected user
  sendmessage: async (messageData) => {
    const { selecteduser, message, users } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selecteduser._id}`, messageData);
      set({ message: [...message, res.data] });
      
      // Update last message time for sorting
      const updatedUsers = users.map((u) =>
        u._id === selecteduser._id ? { ...u, lastMessageTime: Date.now() } : u
      );
      set({ users: updatedUsers });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to send message.');
    }
  },

  // Subscribe to new messages from selected user (real-time)
  subscribetoMessages: () => {
    const { selecteduser } = get();
    if (!selecteduser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off('newMessage');
    socket.on('newMessage', (newMessage) => {
      if (newMessage.senderId === selecteduser._id) {
        set({ message: [...get().message, newMessage] });
      }
    });
  },

  // Subscribe to all incoming messages (for notifications/sorting)
  subscribetoAllMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off('newMessage');
    socket.on('newMessage', (newMessage) => {
      // Update last message time for the sender
      const users = get().users.map((u) =>
        u._id === newMessage.senderId ? { ...u, lastMessageTime: Date.now() } : u
      );
      set({ users });
    });
  },

  // Unsubscribe from message events
  unsubscribetoMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off('newMessage');
    }
  },

  // Set the currently selected user for chat
  setselecteduser: (selecteduser) => {
    set({ selecteduser });
  },

  // Join a user using their invite code
  joinCodeLogic: async (code) => {
    if (!code || code.trim() === '') {
      toast.error('Please enter a valid invite code');
      return;
    }

    try {
      const res = await axiosInstance.post('/messages/join', { inviteCode: code });
      toast.success(res.data.msg || 'Successfully joined!');
      get().getuser(); // Refresh contacts list
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to join with this code');
    }
  },
}));