import React, { useEffect, useState } from 'react';
import { Clock, X, Calendar, MessageSquare, Trash2 } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const ScheduledMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all scheduled messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/schedule');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch scheduled messages.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchMessages();
    }
  }, [isModalOpen]);

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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTimeStatus = (scheduledAt) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diffMs = scheduled - now;
    
    if (diffMs < 0) return { status: 'overdue', color: 'text-red-500', label: 'Overdue' };
    if (diffMs < 60000) return { status: 'soon', color: 'text-orange-500', label: 'Soon' };
    if (diffMs < 3600000) return { status: 'upcoming', color: 'text-blue-500', label: 'Upcoming' };
    return { status: 'scheduled', color: 'text-green-500', label: 'Scheduled' };
  };

  return (
    <>
      {/* Clock Icon Button with Badge */}
      <button
        className="p-2 hover:bg-base-200 rounded-full transition-colors relative"
        onClick={() => setIsModalOpen(true)}
      >
        <Clock size={20} />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {messages.length}
          </span>
        )}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Clock size={24} className="text-primary" />
                Scheduled Messages
              </h3>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                {/* Empty State */}
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No Scheduled Messages</h4>
                    <p className="text-gray-500">You don't have any messages scheduled yet.</p>
                  </div>
                ) : (
                  <>
                    {/* Messages Count */}
                    <div className="bg-base-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          📋 Total Messages: <span className="font-bold">{messages.length}</span>
                        </span>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={fetchMessages}
                          disabled={loading}
                        >
                          🔄 Refresh
                        </button>
                      </div>
                    </div>

                    {/* Messages List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {messages.map((msg) => {
                        const { date, time } = formatDateTime(msg.scheduledAt);
                        const timeStatus = getTimeStatus(msg.scheduledAt);
                        
                        return (
                          <div
                            key={msg._id}
                            className="card bg-base-100 border border-base-300 shadow-sm"
                          >
                            <div className="card-body p-4">
                              {/* Message Content */}
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <p className="font-medium text-base mb-2 leading-relaxed">
                                    "{msg.message}"
                                  </p>
                                  
                                  {/* Schedule Info */}
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      <span>{date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock size={14} />
                                      <span>{time}</span>
                                    </div>
                                    <div className={`badge badge-sm ${timeStatus.color.includes('red') ? 'badge-error' : 
                                      timeStatus.color.includes('orange') ? 'badge-warning' : 
                                      timeStatus.color.includes('blue') ? 'badge-info' : 'badge-success'}`}>
                                      {timeStatus.label}
                                    </div>
                                  </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                  className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-50"
                                  onClick={() => handleDelete(msg._id)}
                                  title="Delete message"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Modal Actions */}
            <div className="modal-action">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
          
          {/* Modal Backdrop */}
          <div 
            className="modal-backdrop" 
            onClick={() => setIsModalOpen(false)}
          ></div>
        </div>
      )}
    </>
  );
};

export default ScheduledMessages;
