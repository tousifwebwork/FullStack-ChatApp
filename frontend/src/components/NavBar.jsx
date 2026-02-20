import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Menu, MessageCircleMore, MessageSquare, Settings, User, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const NavBar = () => {
  const { authUser, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isSettings = location.pathname === '/settings';
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-base-200 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Chatty</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {authUser && (
              <>
                <Link to="/" className="btn btn-sm gap-2">
                  <MessageCircleMore className="size-5" />
                  <span>Chat</span>
                </Link>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span>Profile</span>
                </Link>
                <button className="btn btn-sm gap-2" onClick={logout}>
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
            <button
              onClick={() => (isSettings ? navigate('/') : navigate('/settings'))}
              className="btn btn-sm gap-2 transition-colors"
            >
              {isSettings ? (
                <>
                  <X className="size-5" />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <Settings className="size-5" />
                  <span>Settings</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setOpen(!open)} className="btn btn-sm md:hidden">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-base-100 border-b md:hidden">
          <div className="flex flex-col gap-2 p-4">
            {authUser && (
              <>
                <Link
                  to="/"
                  className="btn btn-sm justify-start gap-2"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircleMore className="size-5" /> Chat
                </Link>
                <Link
                  to="/profile"
                  className="btn btn-sm justify-start gap-2"
                  onClick={() => setOpen(false)}
                >
                  <User className="size-5" /> Profile
                </Link>
                <button
                  className="btn btn-sm justify-start gap-2"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  <LogOut className="size-5" /> Logout
                </button>
              </>
            )}
            {!authUser && (
              <Link
                to="/login"
                className="btn btn-sm justify-start gap-2"
                onClick={() => setOpen(false)}
              >
                <LogIn className="size-5" /> Login
              </Link>
            )}
            <Link
              to="/settings"
              className="btn btn-sm justify-start gap-2"
              onClick={() => setOpen(false)}
            >
              <Settings className="size-5" /> Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar