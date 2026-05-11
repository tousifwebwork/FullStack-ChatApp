import { create } from "zustand";
import axios from "axios";

const useAutoreply = create((set) => ({

    suggestions: [],

    getSmartReplies: async (messages) => {

        try {

            const response = await axios.post(
                "http://localhost:4000/api/auto-message/reply",
                { messages }
            );

            set({
                suggestions: response.data.suggestions
            });

        } catch (err) {

            console.error("Failed to fetch smart replies:", err);

        }
    },

    clearSuggestions: () =>  set({ suggestions: [] })

}));

export default useAutoreply;