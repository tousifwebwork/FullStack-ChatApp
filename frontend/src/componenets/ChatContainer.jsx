import { useEffect, useRef } from 'react'
import {useChatStore} from '../store/usechatstore'
import ChatHeader from './ChatHeader';
import MessgaeInput from './MessageInput';
import MessageSkeleton from './Skeliton/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
const ChatContainer = () => {
  
  const {message,getmessages,ismessagesloading,selecteduser,subscribetoMessages,unsubscribetoMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  useEffect(()=>{
   getmessages(selecteduser._id);
   subscribetoMessages();
   
   return ()=>{
     unsubscribetoMessages();
   }
  },[selecteduser._id,getmessages,subscribetoMessages,unsubscribetoMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [message]);


  if(ismessagesloading){
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          <MessageSkeleton />
        </div>
        <MessgaeInput />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {message.slice().reverse().map((msg)=>(
          <div
          key={msg._id}
          className={`chat ${msg.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={msg.senderId === authUser._id ? authUser.profilePic || '/avatar.png' : selecteduser.profilePic || '/avatar.png'} 
                alt="Profile Pic" />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50'>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {msg.image && <img src={msg.image} className='sm:max-w-50 rounded-md mb-2' alt="Message Image" />}
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessgaeInput />
    </div>
  )
}

export default ChatContainer