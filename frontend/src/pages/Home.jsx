import React from 'react';
import { useChatStore } from '../store/usechatstore';
import ChatContainer from '../components/ChatContainer';
import Sidebar from '../components/Sidebar';
import NochatSelected from '../components/NochatSelected';

const Home = () => {
  const selecteduser = useChatStore((state) => state.selecteduser);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16 sm:pt-20 px-0 sm:px-4">
        <div className="bg-base-100 sm:rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)]">
          <div className="flex flex-col sm:flex-row h-full sm:rounded-lg overflow-hidden">
            
            {/* Desktop Sidebar - always visible on sm+ */}
            <div className="hidden sm:flex flex-col">
              <Sidebar />
            </div>

            {/* Mobile View - toggle between sidebar and chat */}
            <div className="flex sm:hidden flex-col h-full w-full">
              {!selecteduser ? <Sidebar /> : <ChatContainer />}
            </div>

            {/* Desktop Chat Area */}
            <div className="hidden sm:flex flex-1 flex-col">
              {!selecteduser ? <NochatSelected /> : <ChatContainer />}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;