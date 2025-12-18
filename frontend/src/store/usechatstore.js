import {create} from 'zustand';
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set,get)=>({
    message: [],
    users: [],
    selecteduser : null,
    isusersloading : false, 
    ismessagesloading: false,
    lastMessageTime: {}, // Track last message time per user

    getuser: async()=>{
        set({isusersloading:true});
        try{
            const res = await axiosInstance.get('/messages/users');
            set({users: res.data});
        }catch(err){
            toast.error(err.response?.data?.msg || "Failed to fetch users.");
        }finally{
            set({isusersloading:false});
        }
    },

    getmessages: async(userId)=>{
        set({ismessagesloading:true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({message: res.data});
        }catch(err){
            toast.error(err.response?.data?.msg || "Failed to fetch messages.");
        }finally{
            set({ismessagesloading:false});
        }
    },

    sendmessage: async(messagedata)=>{
        const {selecteduser,message} = get();
        try{
            const res = await axiosInstance.post(`/messages/send/${selecteduser._id}`, messagedata);
            set({message: [...message, res.data]});
            
            // Move user to top by updating last message time
            const lastMessageTime = {...get().lastMessageTime};
            lastMessageTime[selecteduser._id] = new Date().getTime();
            set({lastMessageTime});
            
            // Sort users - most recent chat first
            const sortedUsers = [...get().users].sort((a, b) => {
                const timeA = lastMessageTime[a._id] || 0;
                const timeB = lastMessageTime[b._id] || 0;
                return timeB - timeA;
            });
            set({users: sortedUsers});
        }catch(err){
            toast.error(err.response?.data?.msg || "Failed to send message.");
        }
    },

    subscribetoMessages:()=>{
        const {selecteduser} = get();
        if(!selecteduser) return;

        const socket = useAuthStore.getState().socket;
        if(!socket || !socket.connected) return;

        socket.off('newMessage'); // Remove old listener first
        
        socket.on('newMessage',(newMessage)=>{
          // Add message if it's from the selected user (either incoming or outgoing)
          if(newMessage.senderId === selecteduser._id || newMessage.receiverId === selecteduser._id){
            set({message: [...get().message, newMessage]});
            
            // Move user to top by updating last message time
            const lastMessageTime = {...get().lastMessageTime};
            const userId = newMessage.senderId === selecteduser._id ? newMessage.senderId : newMessage.receiverId;
            lastMessageTime[userId] = new Date(newMessage.createdAt).getTime();
            set({lastMessageTime});
            
            // Sort users - most recent chat first
            const sortedUsers = [...get().users].sort((a, b) => {
                const timeA = lastMessageTime[a._id] || 0;
                const timeB = lastMessageTime[b._id] || 0;
                return timeB - timeA;
            });
            set({users: sortedUsers});
          }
        })
    },

     unsubscribetoMessages:()=>{
        
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage')
    },

    setselecteduser: (selecteduser)=>{
        set({selecteduser});
    }

}))