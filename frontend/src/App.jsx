import React, { useEffect } from 'react'
import NavBar from './componenets/NavBar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import {useAuthStore} from './store/useAuthStore'
import {Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

const App = () => { 

  const {authUser,checkAuth,isCheckingAuth,onlineUser} = useAuthStore();

  const {theme} = useThemeStore();
  console.log("Online Users:", onlineUser);
  
  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);


  if(isCheckingAuth && !authUser){ 
    return (
    <div className='flex justify-center items-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>)
  }


  return (
    <div>
     
      <NavBar />
       <Routes>
        <Route path='/' element={authUser? <Home /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser? <SignupPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={ <SettingsPage /> }/>
        <Route path='/profile' element={authUser? <ProfilePage /> : <Navigate to="/login" />} />
       </Routes>
       <Toaster />
    </div>
  )
}

export default App