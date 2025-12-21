import React, { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const ScheduledMessages = () => {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetch all scheduled messages
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get('/schedule');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch scheduled messages.');
    }
  };

  // Fetch messages when dropdown opens
  useEffect(() => {
    if (open) fetchMessages();
  }, [open]);

  // Delete a scheduled message
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/schedule/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
      toast.success('Message deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete message.');
    }
  };

  return (
    <div className="relative">
      {/* Clock Icon with Badge */}
      <button
        className="btn btn-ghost btn-circle relative"
        onClick={() => setOpen(!open)}
      >
        <Clock size={24} />
        {messages.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {messages.length}
          </span>
        )}
      </button>

      {/* Dropdown showing scheduled messages */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-base-100 border rounded shadow-lg p-4 z-50">
          <h3 className="font-bold mb-2">Scheduled Messages</h3>

          {messages.length === 0 ? (
            <p className="text-gray-500">No messages scheduled</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-auto">
              {messages.map((msg) => (
                <li
                  key={msg._id}
                  className="flex justify-between items-start border p-2 rounded"
                >
                  <div>
                    <p className="font-medium">{msg.message}</p>
                    <span className="text-sm text-gray-500">
                      {new Date(msg.scheduledAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    className="btn btn-sm btn-circle btn-ghost"
                    onClick={() => handleDelete(msg._id)}
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduledMessages;
