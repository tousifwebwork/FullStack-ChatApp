import { create } from 'zustand';
import { scheduleMessage } from '../lib/scheduler';
import { useChatStore } from './usechatstore';

export const useShedulerStore = create((set, get) => ({
    isLoading: false,

    schedule: async (message, dateTime) => {
        set({ isLoading: true });
        // Get receiverId from selecteduser in chat store
        const selecteduser = useChatStore.getState().selecteduser;
        const receiverId = selecteduser?._id;
        const res = await scheduleMessage(message, dateTime, receiverId);
        set({ isLoading: false });
        return res;
    },
}));