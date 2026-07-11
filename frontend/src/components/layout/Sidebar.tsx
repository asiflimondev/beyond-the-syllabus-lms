import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Settings,
  LogOut,
  UserPlus,
  User,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavLinkProps {
  isActive: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user's display name (first part of email or fallback)
  const getDisplayName = () => {
    if (!user?.email) return 'User';
    // Get the part before @ and capitalize first letter
    const name = user.email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getMenuItems = () => {
    const items: { path: string; icon: any; label: string }[] = [];

    // Dashboard
    let dashboardPath = '/';
    if (user?.role === 'admin') dashboardPath = '/admin/dashboard';
    else if (user?.role === 'teacher') dashboardPath = '/teacher/dashboard';
    else if (user?.role === 'student') dashboardPath = '/student/dashboard';
    else if (user?.role === 'office') dashboardPath = '/office/dashboard';

    items.push({
      path: dashboardPath,
      icon: LayoutDashboard,
      label: 'Dashboard',
    });

    // Admin
    if (user?.role === 'admin') {
      items.push({ path: '/admin/programs', icon: BookOpen, label: 'Programs' });
      items.push({ path: '/admin/students', icon: Users, label: 'Students' });
      items.push({ path: '/admin/admission', icon: UserPlus, label: 'Admission' });
      items.push({ path: '/admin/teachers', icon: Users, label: 'Teachers' });
      items.push({ path: '/admin/settings', icon: Settings, label: 'Settings' });
    }

    // Office
    if (user?.role === 'office') {
      items.push({ path: '/admin/programs', icon: BookOpen, label: 'Programs' });
      items.push({ path: '/admin/students', icon: Users, label: 'Students' });
      items.push({ path: '/admin/admission', icon: UserPlus, label: 'Admission' });
      items.push({ path: '/office/settings', icon: Settings, label: 'Settings' });
    }

    // Teacher
    if (user?.role === 'teacher') {
      items.push({ path: '/teacher/programs', icon: BookOpen, label: 'My Programs' });
      items.push({ path: '/teacher/students', icon: Users, label: 'My Students' });
      items.push({ path: '/teacher/mock-tests', icon: FileText, label: 'Mock Tests' });
      items.push({ path: '/teacher/settings', icon: Settings, label: 'Settings' });
    }

    // Student
    if (user?.role === 'student') {
      items.push({ path: '/student/mock-tests', icon: FileText, label: 'Mock Tests' });
      items.push({ path: '/student/profile', icon: User, label: 'Profile' });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - REMOVED */}
          {/* Removed the Beyond the Syllabus logo/brand from sidebar */}

          {/* User Info - Updated to show only name */}
          <div className="px-6 py-4 border-b border-gray-200/50 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-sm">
                <span className="text-primary-700 font-semibold text-lg">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-0.5">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }: NavLinkProps) =>
                      `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                    onClick={onClose}
                  >
                    <item.icon className={`w-5 h-5 ${({ isActive }: NavLinkProps) => isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200/50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 text-red-400" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;