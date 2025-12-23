import  {axiosInstance} from './axios';

export const scheduleMessage = async (message, dateTime, receiverId) => {
  try {
    const res = await axiosInstance.post('/schedule', {
      message,
      scheduledAt: dateTime,
      receiverId
    });
    return res.data;
  } catch (err) {
    console.error('Error scheduling message:', err);
    return 'error in scheduling message';
  }
};