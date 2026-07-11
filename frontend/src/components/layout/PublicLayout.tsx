import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import btsLogo from '/bts-logo.png';
import cambridgeLogo from '/cambridge-logo.png';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/programs', label: 'Programs' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
            : 'bg-white/80 backdrop-blur-sm border-b border-gray-200/30'
        }`}
      >
        {/* Main container with max width */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-24">
            {/* Left: BTS Logo + Brand Name */}
            <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
              <img 
                src={btsLogo} 
                alt="BTS Logo" 
                className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                Beyond the Syllabus
              </span>
            </Link>

            {/* Middle: Navigation */}
            <nav className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative ${
                    location.pathname === item.path
                      ? 'text-primary-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {location.pathname === item.path && (
                    <span className="absolute inset-0 bg-primary-50 rounded-xl -z-10" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  <span className={`absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${
                    location.pathname === item.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Right: Cambridge Logo + Mobile Menu */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="hidden sm:flex items-center">
                <img 
                  src={cambridgeLogo} 
                  alt="Cambridge English" 
                  className="h-12 w-auto object-contain"
                />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Login Button - Fixed hover animation */}
        <Link
          to="/login"
          className="hidden md:inline-flex fixed top-1/2 -translate-y-1/2 right-4 lg:right-8 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-300 shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 active:scale-95 z-50"
        >
          Login
        </Link>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="block px-3 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-200 text-center mt-2"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-24">
        {children}
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Beyond the Syllabus
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cambridge English Language Training Center dedicated to helping students achieve their English language goals.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/programs" className="hover:text-white transition-colors">Programs</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Programs</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link to="/programs" className="hover:text-white transition-colors">Movers</Link></li>
                <li><Link to="/programs" className="hover:text-white transition-colors">KET</Link></li>
                <li><Link to="/programs" className="hover:text-white transition-colors">PET</Link></li>
                <li><Link to="/programs" className="hover:text-white transition-colors">FCE</Link></li>
                <li><Link to="/programs" className="hover:text-white transition-colors">CAE</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>📞 +880 1712 345 678</li>
                <li>✉️ info@beyondsyllabus.com</li>
                <li>📍 Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Beyond the Syllabus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;