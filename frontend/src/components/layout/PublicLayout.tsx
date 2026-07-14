import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/programs', label: 'Programs' },
    { path: '/about', label: 'About' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ==========================================
          HEADER WRAPPER - Contains both the glass navbar AND login button
          ========================================== */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Glassmorphism Navbar - STRETCHED FULL WIDTH */}
        <div className="container-fluid pt-4 md:pt-6">
          <div 
            className={`
              relative w-full rounded-2xl md:rounded-3xl px-4 py-3 md:px-6 md:py-4
              transition-all duration-500
              ${isScrolled 
                ? 'bg-white/85 backdrop-blur-xl border border-white/50 shadow-sh-2' 
                : 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg'
              }
            `}
          >
            <div className="flex items-center justify-between">
              {/* Brand - Always visible */}
              <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                <img
                  src={btsLogo}
                  alt="Beyond the Syllabus"
                  className="w-10 h-10 md:w-11 md:h-11 object-contain bg-white/90 rounded-xl p-1.5 shadow-md"
                />
                <div>
                  <span className={`block font-display font-extrabold text-base md:text-lg tracking-tight leading-tight transition-colors duration-300 ${
                    isScrolled ? 'text-blue-900' : 'text-white'
                  }`}>
                    Beyond the Syllabus
                  </span>
                  <span className={`block text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${
                    isScrolled ? 'text-orange-500' : 'text-orange-200'
                  }`}>
                    Cambridge English
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation - Inside glass bar */}
              <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold rounded-xl
                      transition-all duration-300
                      ${isActive(item.path)
                        ? isScrolled
                          ? 'text-blue-600 bg-blue-50/80'
                          : 'text-white bg-white/20'
                        : isScrolled
                          ? 'text-ink-soft hover:text-blue-600 hover:bg-blue-50/50'
                          : 'text-white/80 hover:text-white hover:bg-white/15'
                      }
                    `}
                  >
                    {item.label}
                    {isActive(item.path) && (
                      <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 rounded-full bg-orange-500`} />
                    )}
                  </Link>
                ))}
              </nav>

              {/* Right side - Cambridge Logo + Mobile Menu (inside glass bar) */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Cambridge Logo */}
                <div className="hidden sm:flex items-center">
                  <img
                    src={cambridgeLogo}
                    alt="Cambridge English"
                    className="h-8 md:h-9 w-auto object-contain"
                  />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`
                    md:hidden p-2 rounded-xl transition-all duration-200
                    ${isScrolled 
                      ? 'text-blue-900 hover:bg-blue-50' 
                      : 'text-white hover:bg-white/10'
                    }
                  `}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            LOGIN BUTTON - Far right, BIGGER, aligned with top of glass bar
            ========================================== */}
        <Link
          to="/login"
          className={`
            hidden md:inline-flex fixed top-4 md:top-6 right-4 lg:right-8 
            px-8 py-4 text-base font-bold rounded-full
            transition-all duration-300 z-50
            bg-orange-500 text-white 
            hover:bg-orange-600 hover:-translate-y-0.5
            shadow-sh-orange hover:shadow-sh-orange-lg
          `}
        >
          Login
        </Link>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 mx-4 glass-bg rounded-2xl border border-white/30 shadow-sh-2 overflow-hidden">
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-ink-soft hover:bg-gray-100 hover:text-blue-900'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-200/50">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-center text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="relative text-on-dark-soft pt-16 pb-8 overflow-hidden"
        style={{ background: 'linear-gradient(115deg, #0e1235 0%, #141a4a 44%, #1c2564 100%)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-blue-600 to-orange-500" />

        <div className="container-fluid">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={btsLogo}
                  alt="Beyond the Syllabus"
                  className="w-12 h-12 object-contain bg-white rounded-xl p-1.5"
                />
                <div>
                  <span className="block font-display font-extrabold text-white text-lg leading-tight">
                    Beyond the Syllabus
                  </span>
                  <span className="block text-xs font-bold tracking-widest uppercase text-orange-500">
                    Cambridge English
                  </span>
                </div>
              </div>
              <p className="text-sm text-on-dark-soft max-w-sm leading-relaxed">
                A Cambridge English Language Training Center in Dhaka, Bangladesh — helping learners achieve their English goals, one level at a time.
              </p>
              <div className="flex gap-2 pt-2">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-500 hover:-translate-y-0.5 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-500 hover:-translate-y-0.5 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5.5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-500 hover:-translate-y-0.5 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.7 1.7c1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4a2.5 2.5 0 001.7-1.7C23 15.2 23 12 23 12zM9.8 15.3V8.7l6 3.3z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-500 hover:-translate-y-0.5 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm5.3 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.2.1.6-.1 1.2z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-display text-white text-sm font-bold tracking-widest uppercase mb-4">Programs</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/programs" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Movers · A1</Link></li>
                <li><Link to="/programs" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">KET · A2</Link></li>
                <li><Link to="/programs" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">PET · B1</Link></li>
                <li><Link to="/programs" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">FCE · B2</Link></li>
                <li><Link to="/programs" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">CAE · C1</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-display text-white text-sm font-bold tracking-widest uppercase mb-4">Explore</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">About Us</Link></li>
                <li><Link to="/gallery" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Gallery</Link></li>
                <li><Link to="/faq" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-display text-white text-sm font-bold tracking-widest uppercase mb-4">Get in touch</h5>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Dhaka, Bangladesh</span>
                </li>
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1 1 .3 1.9.6 2.8a2 2 0 01-.5 2.1L8 9.6a16 16 0 006 6l1-1.1a2 2 0 012.1-.5c.9.3 1.8.5 2.8.6a2 2 0 011.7 2z"/>
                  </svg>
                  <span>Contact us to enroll</span>
                </li>
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M22 6l-10 7L2 6"/>
                  </svg>
                  <span>Free placement test on request</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-sm text-on-dark-soft/70">
            <span>© {new Date().getFullYear()} Beyond the Syllabus · Cambridge English Training Center</span>
            <span>Official Cambridge Assessment English preparation center · Dhaka, Bangladesh</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;