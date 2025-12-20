import React, {useEffect, useState } from 'react'
import { useChatStore } from '../store/usechatstore'
import Skeleton from './Skeliton/Skeleton';
import { User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
const Sidebar = () => {

  const {getuser, users, selecteduser,setselecteduser,isusersloading} = useChatStore();
  const { onlineUser } = useAuthStore();
  const [showOnlineOnly, setshowOnlineOnly] = useState(false)

  useEffect(()=>{
    getuser();
  },[getuser])

  
  const filterdUsers = showOnlineOnly ? users.filter(user => onlineUser.includes(user._id)) : users;
  const sortedUsers = [...filterdUsers].sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));


  if(isusersloading){
    return <Skeleton />
  }
  return (
    <>
      <aside className='h-full w-20 lg:w-82 border-r border-base-300 flex flex-col transition-all duration-200 '> 
       
        <div className='border-b border-base-200  w-full p-5'>
          
          {/* Title */}
          <div className='flex items-center gap-2'>
            <User className='size-6' />
            <span className='font-medium hidden lg:block '>Contacts</span>
          </div>
          
          {/* Online title */}
          <div className="mt-3 hidden lg:flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2">
                 <input
                   type="checkbox"
                   checked={showOnlineOnly}
                   onChange={(e) => setshowOnlineOnly(e.target.checked)}
                   className="checkbox checkbox-sm"
                 />
               <span className="text-sm">Show online only</span>
              </label>

             <span className="text-xs text-zinc-500">
              ({users.filter(user => onlineUser.includes(user._id)).length} online)
             </span>
          </div>

        </div>
        

        {/* Bar */}
        <div className='overflow-y-auto w-full py-3 '>
         
  {sortedUsers.map((user) => (
  <button
    key={user._id}
    onClick={() => setselecteduser(user)}
    className={`
      w-full p-3 flex items-center gap-3
      hover:bg-base-300 transition-colors
      ${selecteduser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
    `}
  >
    <div className="relative mx-auto lg:mx-0">
      <img 
        src={user.profilePic || "/avatar.png"}
        alt={user.fullname}
        className="size-12 object-cover rounded-full"
      />
      {onlineUser.includes(user._id) && (
        <span
          className="absolute bottom-0 right-0 size-3 bg-green-500
          rounded-full ring-2 ring-zinc-900"
        />
      )}
    </div>

    {/* User info - only visible on larger screens */}
    <div className="hidden lg:block text-left min-w-0">
      <div className="font-medium truncate">{user.fullname}</div>
      <div className="text-sm text-zinc-400">
        {onlineUser.includes(user._id) ? "Online" : "Offline"}
      </div>
    </div>
  </button>
))}


   {
      filterdUsers.length === 0 && ( <div className='text-center text-zinc-500 py-4' >No Online Users Found</div> )
   }


        </div>

      </aside>
    </>
  )
}

export default Sidebar