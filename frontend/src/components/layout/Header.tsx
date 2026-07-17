import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu as MenuIcon, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import cambridgeLogo from '/cambridge-logo.png';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSettingsPath = () => {
    const role = user?.role;
    if (role === 'admin') return '/admin/settings';
    if (role === 'teacher') return '/teacher/settings';
    if (role === 'student') return '/student/settings';
    if (role === 'office') return '/office/settings';
    return '/settings';
  };

  const getDisplayName = () => {
    if (!user?.email) return 'User';
    return user.email.split('@')[0];
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const getRoleDisplay = () => {
    const role = user?.role;
    if (!role) return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-4 z-30 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg shadow-primary-500/5 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-3">
              <button
                onClick={onMenuClick}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 lg:hidden"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              
              {/* Cambridge Logo instead of BTS Logo */}
              <img 
                src={cambridgeLogo} 
                alt="Cambridge English" 
                className="h-8 w-auto object-contain"
              />
              
              <div className="hidden sm:block">
                <span className="text-sm font-bold text-gray-900 tracking-tight">
                  
                </span>
                <span className="ml-2 text-xs font-medium text-gray-400">
                  {getRoleDisplay()} Panel
                </span>
              </div>
            </div>

            {/* Right section - Removed Search and Notifications */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-medium shadow-sm shadow-primary-500/20">
                    {getUserInitials()}
                  </div>
                  <span className="hidden sm:inline-block font-medium">
                    {getDisplayName()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl ring-1 ring-black/5 divide-y divide-gray-100 animate-scale-in border border-white/50">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-0.5 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary-400" />
                        {getRoleDisplay()}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/profile');
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-400" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate(getSettingsPath());
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Settings
                      </button>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-red-400" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;