import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/usechatstore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './Skeliton/MessageSkeleton';

const ChatContainer = () => {
  const {
    message,
    getmessages,
    ismessagesloading,
    selecteduser,
    subscribetoMessages,
    unsubscribetoMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  // Fetch messages and subscribe to real-time updates
  useEffect(() => {
    getmessages(selecteduser._id);
    subscribetoMessages();

    return () => {
      unsubscribetoMessages();
    };
  }, [selecteduser._id, getmessages, subscribetoMessages, unsubscribetoMessages]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [message]);

  // Show skeleton while loading
  if (ismessagesloading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-200/30">
      <ChatHeader />
      
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
        {message.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${msg.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div className="size-8 sm:size-10 rounded-full border ">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser.profilePic || '/avatar.png'
                      : selecteduser.profilePic || '/avatar.png'
                  }
                  alt="Profile"
                />
              </div>
            </div>

            {/* Timestamp */}
            <div className="chat-header mb-0.5 sm:mb-1">
              <time className="text-[10px] sm:text-xs opacity-50">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>

            {/* Message Bubble */}
            <div
              className={`chat-bubble flex flex-col text-sm sm:text-base max-w-[75%] sm:max-w-[70%] ${
                msg.senderId === authUser._id
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-100'
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  className="max-w-50 sm:max-w-75 rounded-md mb-2"
                  alt="Attachment"
                />
              )}
              {msg.text && <p className="wrap-break-word">{msg.text}</p>}
           
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;