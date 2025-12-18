import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'   
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE == 'development' ? 'http://localhost:4000' : '/';

export const useAuthStore = create((set,get)=>({
    authUser:null, 
    isSigningIn: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUser: [],
    socket:null,

    checkAuth: async ()=>{
        try{
            const res = await axiosInstance.get('/auth/check');
            set({authUser:res.data});
            get().connectSocket();
        }catch(err){
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async (Data)=>{
        set({isSigningIn:true});
        try{
           const res = await axiosInstance.post('/auth/signup', Data);
           set({ authUser: res.data });
           toast.success("Signup successful!");
           get().connectSocket();
        }catch(err){
            toast.error(err.response?.data?.msg || "Signup failed. Please try again.");
        }finally{
            set({isSigningIn:false});
        }
    },

    login: async (Data)=>{
        set({isLoggingIn:true});
        try{
           const res = await axiosInstance.post('/auth/login', Data);
           set({ authUser: res.data });
           toast.success("Login successful!");
           get().connectSocket();
        }catch(err){
            toast.error(err.response?.data?.msg || "Login failed. Please try again.");
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout: async ()=>{
        try{
           await axiosInstance.post('/auth/logout');
           set({ authUser: null });
           toast.success("Logged out successfully.");
           get().disconnectSocket();
        }catch(err){
            toast.error(err.response?.data?.msg || "Logout failed.");
        }
    },

    updateProfile: async (Data)=>{
        set({isUpdatingProfile:true});

        try{
            const res = await axiosInstance.put('/auth/update-profile', Data);
            set({authUser:res.data});
            toast.success("Profile updated successfully.");
        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.msg || "Profile update failed.");
        }finally{
            set({isUpdatingProfile:false});
        }

    },

    connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query:{userId:authUser._id},
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });
        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
            set({socket:socket});
        });
        socket.on('get-online-users',(userIds)=>{
            set({onlineUser:userIds});
        });
        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });
        socket.on('error', (error) => {
            console.error('❌ Socket error:', error);
        });
    },

    disconnectSocket: ()=>{
        if(get().socket?.connected){get().socket.disconnect();}
    }

}));