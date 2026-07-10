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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: BTS Logo + Brand Name */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <img 
                src={btsLogo} 
                alt="BTS Logo" 
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                Beyond the Syllabus
              </span>
            </Link>

            {/* Middle: Navigation - Centered */}
            <nav className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right: Cambridge Logo + Login */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Cambridge Logo */}
              <div className="hidden sm:flex items-center">
                <img 
                  src={cambridgeLogo} 
                  alt="Cambridge English" 
                  className="h-10 w-auto object-contain"
                />
              </div>

              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-sm shadow-primary-500/20 hover:shadow-primary-500/30"
              >
                Login
              </Link>

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
                className="block px-3 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors text-center mt-2"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-20">
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