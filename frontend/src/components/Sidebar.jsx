import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { useChatStore } from '../store/usechatstore';
import { useAuthStore } from '../store/useAuthStore';
import Skeleton from './Skeliton/Skeleton';

const Sidebar = () => {
  const { getuser, users, selecteduser, setselecteduser, isusersloading } = useChatStore();
  const { onlineUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    getuser();
  }, [getuser]);

  // Filter and sort users
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUser.includes(user._id))
    : users;
  const sortedUsers = [...filteredUsers].sort(
    (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
  );
  const onlineUsers = users.filter((user) => onlineUser.includes(user._id));

  if (isusersloading) {
    return <Skeleton />;
  }

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="sm:hidden w-full bg-base-100 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-primary/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chats</h2>
            <label className="cursor-pointer flex items-center gap-2 bg-base-100 px-3 py-1.5 rounded-full text-xs shadow-sm">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-xs checkbox-primary"
              />
              <span className="text-xs font-medium">Online only</span>
            </label>
          </div>
        </div>

        {/* Online Users Horizontal Scroll */}
        {onlineUsers.length > 0 && (
          <div className="border-b border-base-200 py-3 bg-base-200">
            <div className="flex overflow-x-auto gap-4 px-4 scrollbar-hide">
              {onlineUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => setselecteduser(user)}
                  className="flex flex-col items-center gap-1.5 min-w-17"
                >
                  <div
                    className={`relative p-0.5 rounded-full ${
                      selecteduser?._id === user._id
                        ? 'bg-linear-to-tr from-primary to-secondary'
                        : ''
                    }`}
                  >
                    <div className="bg-base-100 p-0.5 rounded-full">
                      <img
                        src={user.profilePic || '/avatar.png'}
                        alt={user.fullname}
                        className="size-14 object-cover rounded-full"
                      />
                    </div>
                    <span className="absolute bottom-1 right-1 size-3.5 bg-green-500 rounded-full ring-2 ring-base-100" />
                  </div>
                  <span className="text-[11px] text-center truncate w-16 font-medium">
                    {user.fullname.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <User className="size-12 mb-2 opacity-50" />
              <p className="text-sm">No contacts found</p>
            </div>
          ) : (
            <div className="divide-y divide-base-200">
              {sortedUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => setselecteduser(user)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-base-200 active:bg-base-300 transition-colors ${
                    selecteduser?._id === user._id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={user.profilePic || '/avatar.png'}
                      alt={user.fullname}
                      className="size-12 object-cover rounded-full"
                    />
                    {onlineUser.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{user.fullname}</span>
                      <span className="text-[10px] text-zinc-500">
                        {onlineUser.includes(user._id) ? 'now' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 truncate">
                      {onlineUser.includes(user._id) ? '🟢 Online' : 'Tap to chat'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== DESKTOP/TABLET VIEW ==================== */}
      <aside className="hidden sm:flex h-full w-20 lg:w-82 border-r border-base-300 flex-col transition-all duration-200">
        {/* Header */}
        <div className="border-base-200 w-full p-5">
          <div className="flex items-center gap-2">
            <User className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>

          {/* Online Filter */}
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">({onlineUsers.length} online)</span>
          </div>
        </div>

        {/* Contact List */}
        <div className="overflow-y-auto w-full py-3">
          {sortedUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setselecteduser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selecteduser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || '/avatar.png'}
                  alt={user.fullname}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUser.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullname}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUser.includes(user._id) ? 'Online' : 'Offline'}
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No users found</div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;