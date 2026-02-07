'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onProfileClick?: () => void;
  onLogout?: () => void;
  showMenu?: boolean;
}

export default function Navbar({ onProfileClick, onLogout, showMenu = true }: NavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.push('/');
    }
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
    if (onProfileClick) {
      onProfileClick();
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <h1 
                className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg"
                style={{ 
                  fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', sans-serif",
                  textShadow: '0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)'
                }}
              >
                FLEXIFY
              </h1>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-60"></div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Home Link */}
            <button
              onClick={() => router.push('/home')}
              className="text-white/90 hover:text-white font-semibold transition-all duration-200 hover:scale-105"
            >
              Home
            </button>

            {/* Notifications Icon */}
            <button
              className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              title="Notifications"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Messages Icon */}
            <button
              className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              title="Messages"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
              </svg>
            </button>

            {/* Menu Button */}
            {showMenu && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-2xl font-bold"
                  title="Menu"
                >
                  ⋯
                </button>

                {menuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl frosted-glass border border-white/20 dark:border-gray-700/50 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600/60 transition duration-200 text-left flex items-center space-x-3"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                          />
                        </svg>
                        <span>Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          // Settings functionality
                        }}
                        className="w-full px-5 py-3 text-sm font-semibold text-white hover:bg-purple-600/60 transition duration-200 text-left flex items-center space-x-3"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                          />
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                          />
                        </svg>
                        <span>Settings</span>
                      </button>

                      <div className="my-1 border-t border-white/10"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full px-5 py-3 text-sm font-semibold text-white hover:bg-red-600/80 transition duration-200 text-left flex items-center space-x-3"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                          />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
