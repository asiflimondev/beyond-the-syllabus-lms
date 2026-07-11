import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu as MenuIcon, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import btsLogo from '/bts-logo.png';
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

  // Close dropdown when clicking outside
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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left section - Logo and Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 lg:hidden"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          
          {/* BTS Logo */}
          <img 
            src={btsLogo} 
            alt="BTS Logo" 
            className="h-8 w-auto object-contain"
          />
          
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            Beyond the Syllabus
          </span>
        </div>

        {/* Right section - Cambridge Logo + User Dropdown */}
        <div className="flex items-center gap-4">
          {/* Cambridge Logo */}
          <img 
            src={cambridgeLogo} 
            alt="Cambridge English" 
            className="h-10 w-auto object-contain"
          />

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline-block font-medium">
                {user?.email?.split('@')[0]}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black/5 divide-y divide-gray-100 animate-scale-in">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">
                    {user?.role}
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
                      navigate('/settings');
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
    </header>
  );
};

export default Header;