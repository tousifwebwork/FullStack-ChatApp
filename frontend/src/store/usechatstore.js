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
        }catch(err){
            toast.error(err.response?.data?.msg || "Failed to send message.");
        }
    },

    subscribetoMessages:()=>{
        const {selecteduser} = get();
        if(!selecteduser) return;

        const socket = useAuthStore.getState().socket;
        if(!socket) return;

        socket.off('newMessage');
        
        socket.on('newMessage',(newMessage)=>{
          if(newMessage.senderId === selecteduser._id){
            set({message: [...get().message, newMessage]});
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