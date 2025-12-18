import React from 'react'
import { X } from 'lucide-react';
import { useChatStore } from '../store/usechatstore';
import { useAuthStore } from '../store/useAuthStore';

const ChatHeader = () => {

  const {selecteduser,setselecteduser} = useChatStore();
  const { onlineUser } = useAuthStore();

  return (
    <> 
    <div className="p-2.5 border-b border-base-300">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="avatar">
        <div className="size-10 rounded-full relative">
          <img src={selecteduser.profilePic || "/avatar.png"} alt={selecteduser.fullName} />
        </div>
      </div>

      {/* User info */}
      <div>
        <h3 className="font-medium">{selecteduser.fullname}</h3>
        <p className="text-sm text-base-content/70">
          {onlineUser.includes(selecteduser._id) ? "Online" : "Offline"}
        </p>
      </div>
    </div>
{/* Close button */}
<button
style={{cursor: "pointer"}} className="hover:bg-base-300 px-2 py-1 rounded-xl"
onClick={() => setselecteduser(null)}>
    <X  />
</button>
  </div>
</div>
    </>
  )
}

export default ChatHeader