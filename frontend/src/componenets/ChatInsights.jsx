import React, { useState, useEffect } from 'react';
import { BarChart3, X, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { useChatStore } from '../store/usechatstore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ChatInsights = () => {
  const [insights, setInsights] = useState({ positive: 0, negative: 0 });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selecteduser } = useChatStore();

  const fetchInsights = async () => {
    if (!selecteduser) return;
    
    setLoading(true);
    try {
      // Generate chatId using sorted user IDs to ensure consistency
      // This creates the same chatId regardless of who sends the message
      const { authUser } = useAuthStore.getState();
      
      // Check if authUser exists to prevent errors
      if (!authUser || !authUser._id) {
        console.error('Auth user not found');
        toast.error('Please login again');
        return;
      }
      
      const userId1 = authUser._id;
      const userId2 = selecteduser._id;
      const chatId = [userId1, userId2].sort().join('_');
      
      console.log('Fetching insights for chatId:', chatId);
      const response = await axiosInstance.get(`/insights/insights/${chatId}`);
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast.error('Failed to load chat insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && selecteduser) {
      fetchInsights();
    }
  }, [isModalOpen, selecteduser]);

  const getEmojiFromScore = (positive, negative) => {
    const total = positive + negative;
    if (total === 0) return { emoji: '🤔', mood: 'No messages yet' };
    
    const positiveRatio = positive / total;
    
    if (positiveRatio >= 0.8) return { emoji: '😄', mood: 'Very Positive' };
    if (positiveRatio >= 0.6) return { emoji: '😊', mood: 'Positive' };
    if (positiveRatio >= 0.4) return { emoji: '😐', mood: 'Neutral' };
    if (positiveRatio >= 0.2) return { emoji: '😕', mood: 'Negative' };
    return { emoji: '😢', mood: 'Very Negative' };
  };

  const { emoji, mood } = getEmojiFromScore(insights.positive, insights.negative);
  const total = insights.positive + insights.negative;

  return (
    <>
      {/* Insights Icon Button */}
      <button
        className="p-2 hover:bg-base-200 rounded-full transition-colors relative"
        onClick={() => setIsModalOpen(true)}
        disabled={!selecteduser}  >
        <BarChart3 size={20} />
        {/* {selecteduser && total > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {total}
          </span>
        )} */}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-xl h-120">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <BarChart3 size={24} className="text-primary" />
                Chat Insights
                {selecteduser && (
                  <span className="text-sm font-normal text-gray-500">
                    with {selecteduser.fullname}
                  </span>
                )}
              </h3>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {!selecteduser ? (
              <div className="text-center py-8">
                <Activity size={48} className="mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No Chat Selected</h4>
                <p className="text-gray-500">Select a chat to view sentiment insights</p>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Overall Mood - Large Display */}
                <div className="text-center p-6 bg-linear-to-br from-base-200 to-base-300 rounded-xl">
                  <div className="text-8xl mb-3">{emoji}</div>
                  <h4 className="text-2xl font-bold mb-2">{mood}</h4>
                  <p className="text-sm text-gray-500">Overall conversation sentiment</p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <TrendingUp size={24} className="mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-green-600">{insights.positive}</div>
                    <p className="text-xs text-green-700 dark:text-green-400">Positive</p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <Activity size={24} className="mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{total}</div>
                    <p className="text-xs text-blue-700 dark:text-blue-400">Total</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                    <TrendingDown size={24} className="mx-auto text-red-600 mb-2" />
                    <div className="text-2xl font-bold text-red-600">{insights.negative}</div>
                    <p className="text-xs text-red-700 dark:text-red-400">Negative</p>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="card-body p-4">
                      <h5 className="card-title text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                        😊 Positive Sentiment
                      </h5>
                      <div className="text-3xl font-bold text-green-600">{insights.positive}</div>
                      {total > 0 && (
                        <div className="text-sm text-green-600">
                          {((insights.positive / total) * 100).toFixed(1)}% of messages
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="card-body p-4">
                      <h5 className="card-title text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                        😔 Negative Sentiment
                      </h5>
                      <div className="text-3xl font-bold text-red-600">{insights.negative}</div>
                      {total > 0 && (
                        <div className="text-sm text-red-600">
                          {((insights.negative / total) * 100).toFixed(1)}% of messages
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar Visualization */}
                <div className="card bg-base-200 border">
                  <div className="card-body p-4">
                    <h5 className="card-title text-sm mb-3 flex items-center gap-2">
                      📈 Sentiment Distribution
                    </h5>
                    {total === 0 ? (
                      <p className="text-sm text-gray-600 text-center py-4">
                        No sentiment data available yet. Start chatting to see insights!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Positive vs Negative</span>
                          <span>{((insights.positive / total) * 100).toFixed(1)}% positive</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="flex h-full">
                            <div 
                              className="bg-green-500 transition-all duration-500 ease-out" 
                              style={{ width: `${(insights.positive / total) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-red-500 transition-all duration-500 ease-out" 
                              style={{ width: `${(insights.negative / total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>😊 {insights.positive} positive</span>
                          <span>😔 {insights.negative} negative</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Refresh Section */}
                <div className="bg-base-200 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      📊 Analysis of {total} messages
                    </span>
                    <button 
                      onClick={fetchInsights}
                      className="btn btn-sm btn-ghost"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        '🔄 Refresh'
                      )}
                    </button>
                  </div>
                </div>
              </div>
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

export default ChatInsights;