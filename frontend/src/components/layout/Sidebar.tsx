import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
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

  const getMenuItems = () => {
    const items: { path: string; icon: any; label: string }[] = [];

    // ✅ Dashboard - role-specific (ONLY ONE)
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

    // Admin Menu Items
    if (user?.role === 'admin') {
      items.push({
        path: '/admin/programs',
        icon: BookOpen,
        label: 'Programs',
      });
      items.push({
        path: '/admin/students',
        icon: Users,
        label: 'Students',
      });
      items.push({
        path: '/admin/admission',
        icon: UserPlus,
        label: 'Admission',
      });
      items.push({
        path: '/admin/teachers',
        icon: Users,
        label: 'Teachers',
      });
      items.push({
        path: '/admin/settings',
        icon: Settings,
        label: 'Settings',
      });
    }

    // Office Menu Items
    if (user?.role === 'office') {
      items.push({
        path: '/admin/programs',
        icon: BookOpen,
        label: 'Programs',
      });
      items.push({
        path: '/admin/students',
        icon: Users,
        label: 'Students',
      });
      items.push({
        path: '/admin/admission',
        icon: UserPlus,
        label: 'Admission',
      });
      items.push({
        path: '/office/settings',
        icon: Settings,
        label: 'Settings',
      });
    }

    // ✅ Teacher Menu Items (NO Dashboard here, already added above)
    if (user?.role === 'teacher') {
      items.push({
        path: '/teacher/programs',
        icon: BookOpen,
        label: 'My Programs',
      });
      items.push({
        path: '/teacher/students',
        icon: Users,
        label: 'My Students',
      });
      items.push({
        path: '/teacher/mock-tests',
        icon: FileText,
        label: 'Mock Tests',
      });
      items.push({
        path: '/teacher/settings',
        icon: Settings,
        label: 'Settings',
      });
    }

    // ✅ Student Menu Items (NO Dashboard here, already added above)
    if (user?.role === 'student') {
      // ✅ Dashboard is ALREADY added above - DON'T add it again!
      // Only add student-specific items
      items.push({
        path: '/student/mock-tests',
        icon: FileText,
        label: 'Mock Tests',
      });
      items.push({
        path: '/student/profile',
        icon: User,
        label: 'Profile',
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-800">
                Beyond the Syllabus
              </span>
            </div>
          </div>

          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-lg">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }: NavLinkProps) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;