import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useShedulerStore } from '../store/useScheduleStore';
import toast from 'react-hot-toast';

const Schedule = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [time, setTime] = useState('');

  const { isLoading, schedule } = useShedulerStore();

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!message || !time) return;

    try {
      await schedule(message, time);
      toast.success('Message scheduled successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to schedule message.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-96 relative">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <X size={16} />
        </button>

        <h3 className="font-bold text-lg mb-4">Schedule Message</h3>

        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your text..."
            className="border-2 w-full p-4 border-gray-600 rounded-lg"
          />

          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border-2 w-full p-4 border-gray-600 rounded-lg"
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSchedule}
            disabled={isLoading || !message || !time}
            className="p-3 w-full bg-blue-400 rounded-2xl text-xl mt-2 mb-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Scheduling...' : 'Schedule'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
