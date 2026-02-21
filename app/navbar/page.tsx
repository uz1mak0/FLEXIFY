'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onProfileClick?: () => void;
  onLogout?: () => void;
  showMenu?: boolean;
  onSelectConversation?: (userName: string) => void; 
}

// Animated F Logo Component remains the same
function AnimatedFLogo() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 100 100"
      className="transition-all duration-300 hover:scale-110"
      style={{
        filter: 'drop-shadow(0 0 5px rgba(147, 51, 234, 0.5))'
      }}
    >
      <defs>
        <linearGradient id="fGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="rgbHoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0000">
            <animate attributeName="stop-color" values="#ff0000;#00ff00;#0000ff;#ff0000" dur="1.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="33%" stopColor="#00ff00">
            <animate attributeName="stop-color" values="#00ff00;#0000ff;#ff0000;#00ff00" dur="1.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="66%" stopColor="#0000ff">
            <animate attributeName="stop-color" values="#0000ff;#ff0000;#00ff00;#0000ff" dur="1.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#ff0000">
            <animate attributeName="stop-color" values="#ff0000;#00ff00;#0000ff;#ff0000" dur="1.5s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      
      <text
        x="50" y="75"
        fontFamily="'Orbitron', sans-serif"
        fontSize="75"
        fontWeight="bold"
        textAnchor="middle"
        fill="url(#fGradient)"
        className="transition-all duration-300"
        style={{ transition: 'fill 0.3s ease' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.fill = 'url(#rgbHoverGradient)';
          e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.8))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.fill = 'url(#fGradient)';
          e.currentTarget.style.filter = 'drop-shadow(0 0 5px rgba(147, 51, 234, 0.5))';
        }}
      >
        F
      </text>
    </svg>
  );
}


export default function Navbar({ onProfileClick, onLogout, showMenu = true, onSelectConversation }: NavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const messages = [
    { id: 1, name: 'Sarah Miller', text: 'Did you check the new design?', time: '2m', unread: true },
    { id: 2, name: 'Alex Rivera', text: 'The API is now live!', time: '1h', unread: false },
    { id: 3, name: 'Dev Team', text: 'Meeting moved to 3 PM', time: '3h', unread: false },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setChatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else router.push('/');
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
    if (onProfileClick) onProfileClick();
  };

  const handleLogoClick = () => {
    router.push('/home');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogoClick}
              className="relative cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <AnimatedFLogo />
            </button>
          </div>

          <div className="flex items-center space-x-6">
            {/* Notifications Icon */}
            <button
              className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              title="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Chat Dropdown Section */}
            <div className="relative" ref={chatRef}>
              <button
                onClick={() => {
                  setChatOpen(!chatOpen);
                  setMenuOpen(false); 
                }}
                className={`relative p-2 rounded-full transition-all duration-200 ${
                  chatOpen ? 'bg-blue-600/20 text-blue-400' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                title="Messages"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 text-[10px] font-bold text-white items-center justify-center">
                    1
                  </span>
                </span>
              </button>

              {chatOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#1c1c21] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black ring-opacity-5">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Chats</h3>
                    <button className="text-blue-400 text-xs hover:underline">Mark all read</button>
                  </div>
                  
                  <div className="max-h-[420px] overflow-y-auto">
                    {messages.map((msg) => (
                      <button 
                        key={msg.id}
                        onClick={() => {
                          if (onSelectConversation) onSelectConversation(msg.name);
                          setChatOpen(false); 
                        }}
                        className="w-full p-3 flex items-center space-x-3 hover:bg-white/5 transition duration-150 text-left"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {msg.name[0]}
                          </div>
                          {msg.unread && (
                            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-blue-500 border-2 border-[#1c1c21] rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className={`text-sm font-semibold truncate ${msg.unread ? 'text-white' : 'text-gray-300'}`}>
                              {msg.name}
                            </p>
                            <span className="text-[10px] text-gray-500">{msg.time}</span>
                          </div>
                          <p className={`text-xs truncate ${msg.unread ? 'text-blue-100 font-medium' : 'text-gray-400'}`}>
                            {msg.text}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {showMenu && (
              <div className="relative">
                <button
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    setChatOpen(false);
                  }}
                  className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-2xl font-bold"
                  title="Menu"
                >
                  ⋯
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600/60 transition duration-200 text-left flex items-center space-x-3"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile</span>
                      </button>
                      
                      <div className="my-1 border-t border-white/10"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full px-5 py-3 text-sm font-semibold text-white hover:bg-red-600/80 transition duration-200 text-left flex items-center space-x-3"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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