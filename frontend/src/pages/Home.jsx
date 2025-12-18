import React from 'react'
import { useChatStore } from '../store/usechatstore'
import ChatContainer from '../componenets/ChatContainer'
import Sidebar from '../componenets/Sidebar'
import NochatSelected from '../componenets/NochatSelected'
const Home = () => {
  const selecteduser = useChatStore((state) => state.selecteduser);
  return (
    <>
    <div className='h-screen bg-base-200 '>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
         <div className='flex h-full rounded-lg overflow-hidden'>
          <Sidebar />
          {
            !selecteduser ? <NochatSelected /> : <ChatContainer />
          }
         </div>
        </div>
      </div> 
    </div>
    </>
  )
}

export default Home