import { ArrowLeft, Phone, Video, X } from 'lucide-react';
import { useChatStore } from '../store/usechatstore';
import { useAuthStore } from '../store/useAuthStore';

const ChatHeader = () => {
  const { selecteduser, setselecteduser } = useChatStore();
  const { onlineUser } = useAuthStore();
  const isOnline = onlineUser.includes(selecteduser._id);

  return (
    <div className="px-3 py-2 sm:p-2.5 border-b border-base-300 bg-base-100">
      <div className="flex items-center justify-between">
        
        {/* Left: Back button + User info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back button (mobile only) */}
          <button
            onClick={() => setselecteduser(null)}
            className="sm:hidden p-1.5 -ml-1 hover:bg-base-200 rounded-full transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>

          {/* Avatar with online indicator */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selecteduser.profilePic || '/avatar.png'}
                alt={selecteduser.fullname}
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>
          </div>

          {/* User name and status */}
          <div className="min-w-0">
            <h3 className="font-medium text-sm sm:text-base truncate">
              {selecteduser.fullname}
            </h3>
            <p className="text-xs sm:text-sm text-base-content/70">
              {isOnline ? (
                <span className="text-green-500">Online</span>
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2 hover:bg-base-200 rounded-full transition-colors">
            <Phone className="size-5" />
          </button>
          <button className="p-2 hover:bg-base-200 rounded-full transition-colors">
            <Video className="size-5" />
          </button>
          {/* Close button (desktop only) */}
          <button
            onClick={() => setselecteduser(null)}
            className="hidden sm:block p-2 hover:bg-base-200 rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ChatHeader;