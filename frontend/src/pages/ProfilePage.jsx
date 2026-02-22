import {useState, useEffect} from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/usechatstore'
import { Camera, Mail, User, UserPlus } from 'lucide-react';
const ProfilePage = () => {

  const { authUser,isUpdatingProfile,updateProfile, invitecode, joincodefunction } = useAuthStore();
  const { joinCodeLogic } = useChatStore();
  const [selectedImage, setselectedImage] = useState(null)
  const [code, setCode] = useState('')

  useEffect(() => {
    joincodefunction();
  }, [joincodefunction]);

  const handleImageUplode = (e)=>{
  const file = e.target.files[0];

  if(!file)return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setselectedImage(base64Image);
      await updateProfile({profilePic:base64Image});
    
  }
}
  return (
    <>

    <div className='h-screen pt-20'>
      <div className=' max-w-2xl mx-auto py-8 px-4'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile Settings</h1>
            <p className='text-base-content/60'>Your profile information</p>
          </div>
          {/* avator uplode */}
          <div className='flex flex-col items-center gap-4'>
            <div className="relative">
         <img
            src={authUser?.profilePic || selectedImage || "/avatar.png"}
            alt="Profile"
            className="size-32 rounded-full object-cover border-4 "
           />
  <label
    htmlFor="avatar-upload"
    className={`
      absolute bottom-0 right-0
      bg-base-content hover:scale-105
      p-2 rounded-full cursor-pointer
      transition-all duration-200
      ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
    `}
  >
    <Camera className="w-5 h-5 text-base-200" />
    <input
      type="file"
      id="avatar-upload"
      className="hidden"
      accept="image/*"
      onChange={handleImageUplode}
      disabled={isUpdatingProfile}
    />
  </label>
            </div>
            <p className='text-sm text-zinc-600'>
              {isUpdatingProfile ? 'Updating profile picture...' : 'Click the camera icon to change your profile picture.'}
            </p>
            
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-2">
              My Code: 
              <span className="font-mono font-semibold bg-base-200 px-3 py-1.5 rounded-lg border">
                {invitecode || 'Loading...'}
              </span>
            </p>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-lg cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() => document.getElementById('invite_modal').showModal()}
            >
              <UserPlus className="w-4 h-4" />
              Invite
            </button>
          </div>

          {/* Invite Modal */}
          <dialog id="invite_modal" className="modal">
            <div className="modal-box w-60">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h3 className="font-bold text-lg mb-4 ">Invite User</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Enter Your Friend's Code" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="input border-2 w-full focus:outline-none focus:border-primary" 
                />
                <button className="btn btn-primary w-full" onClick={() => joinCodeLogic(code)}>Join</button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>





          </div>

        <div className="space-y-6">
  <div className="space-y-1.5">
    <div className="text-sm text-zinc-400 flex items-center gap-2">
      <User className="w-4 h-4" />
      Full Name
    </div>
    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullname}</p>
  </div>
  
  <div className="space-y-1.5">
    <div className="text-sm text-zinc-400 flex items-center gap-2">
      <Mail className="w-4 h-4" />
      Email Address
    </div>
    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
  </div>

  <div className="mt-6 bg-base-300 rounded-xl p-6">
    <h2 className="text-lg font-medium mb-4">Account Information</h2>
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between py-2 border-b border-zinc-700">
        <span>Member Since</span>
        <span>{authUser.createdAt?.split("T")[0]}</span>
      </div>
      <div className="flex items-center justify-between py-2">
        <span>Account Status</span>
        <span className="text-green-500">Active</span>
      </div>
    </div>
  </div>
</div>





        </div>
      </div>
    </div>

    </>
  )
}

export default ProfilePage