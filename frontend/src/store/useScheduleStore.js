import {create} from 'zustand';
import {scheduleMessage} from '../lib/scheduler';

export const useShedulerStore = create((set,get) =>
    ({
    isLoading:false,

    schedule: async(message,dateTime) =>{
        set({isLoading:true});
        const res = await scheduleMessage(message,dateTime);
        set({isLoading:false});
        return res;
    }
})
);