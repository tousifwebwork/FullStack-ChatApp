import  {axiosInstance} from './axios';

export const scheduleMessage = async (message, dateTime) => {
    try {
    const res = await axiosInstance.post('/schedule', {
      message,
      scheduledAt: dateTime
    });
    return res.data;
  } catch (err) {
    console.error('Error scheduling message:', err);
    return 'error in scheduling message';
  }
};