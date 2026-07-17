import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Receipt,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDisplayName = () => {
    if (!user?.email) return 'User';
    const name = user.email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const getRoleColor = () => {
    const role = user?.role;
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'teacher': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'student': return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
      case 'office': return 'bg-gradient-to-r from-orange-500 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getMenuItems = () => {
    const items: { path: string; icon: any; label: string }[] = [];

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

    if (user?.role === 'admin') {
      items.push({ path: '/admin/programs', icon: BookOpen, label: 'Programs' });
      items.push({ path: '/admin/students', icon: Users, label: 'Students' });
      items.push({ path: '/admin/admission', icon: UserPlus, label: 'Admission' });
      items.push({ path: '/admin/receipts', icon: Receipt, label: 'Receipts' });
      items.push({ path: '/admin/mock-tests', icon: FileText, label: 'Mock Tests' });
      items.push({ path: '/admin/reports', icon: FileText, label: 'Reports' });
      items.push({ path: '/admin/teachers', icon: Users, label: 'Teachers' });
      items.push({ path: '/admin/settings', icon: Settings, label: 'Settings' });
    }

    if (user?.role === 'office') {
      items.push({ path: '/admin/programs', icon: BookOpen, label: 'Programs' });
      items.push({ path: '/admin/students', icon: Users, label: 'Students' });
      items.push({ path: '/admin/admission', icon: UserPlus, label: 'Admission' });
      items.push({ path: '/admin/receipts', icon: Receipt, label: 'Receipts' });
      items.push({ path: '/office/mock-tests', icon: FileText, label: 'Mock Tests' });
      items.push({ path: '/office/settings', icon: Settings, label: 'Settings' });
    }

    if (user?.role === 'teacher') {
      items.push({ path: '/teacher/programs', icon: BookOpen, label: 'My Programs' });
      items.push({ path: '/teacher/students', icon: Users, label: 'My Students' });
      items.push({ path: '/teacher/mock-tests', icon: FileText, label: 'Mock Tests' });
      items.push({ path: '/teacher/reports', icon: FileText, label: 'Reports' });
      items.push({ path: '/teacher/settings', icon: Settings, label: 'Settings' });
    }

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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-all duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Section */}
          <div className="px-6 py-5 border-b border-gray-200/30 bg-gradient-to-r from-primary-50/30 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight font-display">
                  Beyond the Syllabus
                </h1>
                <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">
                  {user?.role || 'Guest'} Panel
                </p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="px-4 py-4 border-b border-gray-200/30">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-gray-50/80 to-white/50 hover:from-gray-100/80 hover:to-white transition-all duration-300 cursor-pointer border border-gray-200/20">
              <div className="relative">
                <div className={`w-11 h-11 rounded-xl ${getRoleColor()} flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary-500/20`}>
                  {getUserInitials()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {getDisplayName()}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 border border-primary-200/50">
                    {user?.role || 'Guest'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="mb-3 px-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Main Menu
              </p>
            </div>
            <ul className="space-y-0.5">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                const isHovered = hoveredItem === item.path;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive: navActive }: { isActive: boolean }) => {
                        const active = navActive || isActive;
                        return `relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group ${
                          active
                            ? 'bg-gradient-to-r from-primary-500/10 to-primary-600/10 text-primary-700 shadow-sm ring-1 ring-primary-500/20'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                        }`;
                      }}
                      onClick={onClose}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {({ isActive: navActive }: { isActive: boolean }) => {
                        const active = navActive || isActive;
                        return (
                          <>
                            {active && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-primary-500 to-primary-600 shadow-sm shadow-primary-500/30" />
                            )}
                            <item.icon 
                              className={`w-5 h-5 transition-all duration-300 ${
                                active
                                  ? 'text-primary-600'
                                  : 'text-gray-400 group-hover:text-gray-600'
                              } ${isHovered ? 'scale-110' : ''}`} 
                            />
                            <span className="flex-1 transition-colors duration-200">
                              {item.label}
                            </span>
                            <ChevronRight 
                              className={`w-4 h-4 transition-all duration-300 ${
                                isHovered || active
                                  ? 'opacity-100 translate-x-0 text-primary-400'
                                  : 'opacity-0 -translate-x-2'
                              }`} 
                            />
                          </>
                        );
                      }}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Footer Decoration */}
            <div className="mt-6 pt-4 border-t border-gray-200/20">
              <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-primary-50/20 to-transparent">
                <p className="text-[10px] text-gray-400">
                  {new Date().getFullYear()} © Beyond the Syllabus
                </p>
              </div>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200/30 bg-gradient-to-r from-gray-50/30 to-white/50">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 hover:shadow-md hover:shadow-red-500/10"
            >
              <div className="p-1.5 rounded-lg bg-red-100/50 group-hover:bg-red-100 transition-colors duration-300">
                <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;