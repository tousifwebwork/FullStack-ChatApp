import React from 'react'  
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, MessageCircleMore, MessageSquare, Settings, User } from 'lucide-react';

const NavBar = () => { 
  const { authUser, logout } = useAuthStore();
  
  return (
    <header className='border-b border-base-200 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <Link to='/' className='flex items-center gap-2'>
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Chatty</h1>
          </Link>

          <div className='flex items-center gap-3 '>
            

            {authUser && (
              <>
              <button className='btn btn-sm gap-2'>
                 <Link to='/' className='flex items-center gap-2'>
                <MessageCircleMore className='size-5' /> Chat
                 </Link>
              </button>
                <Link to={`/profile`} className='btn btn-sm gap-2'>
                  <User className='size-5' />
                  <span className='hidden sm:inline'>Profile</span>
                </Link>
                <button className='btn btn-sm gap-2' onClick={logout}>
                  <LogOut className='size-5' />
                  <span className='hidden sm:inline'>Logout</span>
                </button>
              </>
            )}
            <Link to='/settings' className='btn btn-sm gap-2 transition-colors'>
              <Settings className='size-5' />
              <span className='hidden sm:inline'>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar