'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib';
import Navbar from '@/app/navbar/page';
import UserProfile from '@/app/userProfile/page';

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // --- Post Creation States ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Controls post modal emoji picker
  const [showProfileModal, setShowProfileModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Chat Specific States ---
  const [showChat, setShowChat] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{sender: string, text: string, type: 'text' | 'media', file?: string}[]>([
    { sender: 'System', text: 'Welcome to Flexify chat!', type: 'text' }
  ]);
  const [showChatEmoji, setShowChatEmoji] = useState(false);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '😍', '😢', '😎', '🎉', '👍', '♥️', '🔥', '✨', '😡', '😱', '🤔', '😴', '🙏', '💪', '🎊', '💯'];

  // --- Post Logic ---
  const handleCreatePost = () => {
    if (!newContent.trim() && uploadedFiles.length === 0) return;

    const newPost: Post = {
      id: Date.now(),
      author: "You",
      time: "Just now", 
      content: newContent,
      likes: 0,
      weight: 1.0,
    };

   
    setPosts((prev) => [newPost, ...prev]);
    
    // Clear state
    setNewContent('');
    setUploadedFiles([]);
    setShowCreateModal(false);
    setShowEmojiPicker(false);
  };

  const handlePostFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
      setShowCreateModal(true); 
    }
  };

  // --- Chat Logic ---
  const handleSelectConversation = (userName: string) => {
    setActiveChatUser(userName);
    setShowChat(true);
    if (!chatMessages.some(m => m.sender === userName)) {
      setChatMessages(prev => [...prev, { sender: userName, text: `Hey! Let's chat.`, type: 'text' }]);
    }
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'You', text: chatInput, type: 'text' }]);
    setChatInput('');
    setShowChatEmoji(false);
  };

  const handleChatFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setChatMessages(prev => [...prev, { 
          sender: 'You', 
          text: `Sent an attachment: ${file.name}`, 
          type: 'media', 
          file: event.target?.result as string 
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Feed Logic ---
  const loadFeed = useCallback(async (pageNum: number) => {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        const response = await fetch(`/api/feed?page=${pageNum}`);
        const data = await response.json();

        
        if (!data || data.length === 0) {
          setHasMore(false); 
        } else {
          setPosts((prev) => [...prev, ...data]);
        }
      } catch(err) {
        console.error('Feed Error:', err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
  }, [loading, hasMore]);

  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadFeed(page);
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (currentSentinel) observer.observe(currentSentinel);
    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [page, loading, hasMore, loadFeed]);

  useEffect(() => { loadFeed(1); }, []);

  const renderPost = (post: Post) => (
    <div key={`${post.id}-${post.author}`} className="bg-white/10 frosted-glass border border-white/20 rounded-xl p-4 text-white transition-all hover:bg-white/15">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">{post.author[0]}</div>
        <div>
          <p className="font-bold">{post.author}</p>
          <p className="text-xs text-gray-400">{post.time}</p>
        </div>
      </div>
      <p className="mb-4">{post.content}</p>
      <div className="flex space-x-4 border-t border-white/10 pt-3">
        <button className="hover:text-blue-400 transition">👍 {post.likes}</button>
        <button className="hover:text-blue-400 transition">💬 Comment</button>
      </div>
    </div>
  );

  return (
    <>
      <section className="showcase relative min-h-screen flex justify-center items-start bg-gray-100 dark:bg-gray-900">
        <video src="/star.mp4" muted loop autoPlay className="fixed top-0 left-0 w-full h-full object-cover" />

        <Navbar
          onProfileClick={() => setShowProfileModal(true)}
          onLogout={() => router.push('/')}
          onSelectConversation={handleSelectConversation} 
        />

        <UserProfile isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

        <div className="main-content relative z-10 w-full flex flex-col items-center pt-32 p-4 space-y-6">
          {/* Create Post Widget */}
          <div className="w-full max-w-xl bg-white/10 dark:bg-gray-900/40 frosted-glass border border-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3 border-b border-white/10 pb-3">
              <div
                role="button"
                onClick={() => setShowCreateModal(true)}
                className="flex-1 bg-white/5 p-2 rounded-full text-white hover:bg-white/10 transition cursor-pointer"
              >
                Share your thoughts?
              </div>
            </div>
            <div className="flex justify-around text-sm font-semibold text-white">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex items-center space-x-2 hover:bg-white/10 p-2 rounded-lg transition"
              >
                <span className="text-xl">🖼️</span><span>Photo/Video</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                multiple 
                onChange={handlePostFileUpload} 
                accept="image/*,video/*"
              />
            </div>
          </div>

          <div id="post-feed" className="w-full max-w-xl space-y-4">
            {posts.map(renderPost)}
          </div>

          <div ref={sentinelRef} className="h-20 w-full flex items-center justify-center">
            {loading && <div className="animate-pulse text-white">Loading...</div>}
          </div>
        </div>

        {/* --- CREATE POST MODAL --- */}
        {showCreateModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-gray-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg">Create Post</h3>
                <button 
                    onClick={() => {
                        setShowCreateModal(false); 
                        setUploadedFiles([]); 
                        setShowEmojiPicker(false);
                    }} 
                    className="text-gray-400 hover:text-white text-2xl"
                >
                    ×
                </button>
              </div>
              <div className="p-4">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full h-32 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-lg"
                />
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 p-2 bg-white/5 rounded-lg border border-white/10 text-xs text-blue-400">
                    📎 {uploadedFiles.length} file(s) attached
                  </div>
                )}
              </div>
              
              {/* Updated Modal Footer with Emoji Picker and Post Button */}
              <div className="p-4 border-t border-white/10 flex justify-between items-center">
                <div className="relative">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                    className="text-xl p-2 hover:bg-white/10 rounded-full transition"
                    title="Add Emoji"
                  >
                    😊
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 border border-white/10 rounded-lg grid grid-cols-6 gap-1 z-[120] shadow-xl w-48">
                      {emojis.map(e => (
                        <button 
                          key={e} 
                          onClick={() => setNewContent(prev => prev + e)} 
                          className="hover:scale-125 transition p-1"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleCreatePost}
                  disabled={!newContent.trim() && uploadedFiles.length === 0}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- FLOATING CHAT WINDOW --- */}
        {showChat && (
          <div className="fixed bottom-6 right-6 z-[100] w-80 h-[450px] bg-gray-900/95 frosted-glass border border-white/20 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5">
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-blue-600/30 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                  {activeChatUser ? activeChatUser[0] : 'F'}
                </div>
                <span className="text-white font-bold text-sm">{activeChatUser || 'Chat'}</span>
              </div>
              <button onClick={() => setShowChat(false)} className="text-white/60 hover:text-white transition">×</button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-black/20">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-2 rounded-xl text-xs ${
                    msg.sender === 'You' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200 border border-white/5'
                  }`}>
                    {msg.type === 'media' && msg.file && (
                      <img src={msg.file} alt="attachment" className="rounded-lg mb-1 max-h-32 object-cover" />
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {showChatEmoji && (
              <div className="absolute bottom-16 left-2 right-2 p-2 bg-gray-800 border border-white/10 rounded-lg grid grid-cols-6 gap-1 z-10 shadow-xl">
                {emojis.map(e => (
                  <button key={e} onClick={() => setChatInput(prev => prev + e)} className="hover:scale-110 transition">{e}</button>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-white/10 bg-black/40 rounded-b-2xl flex items-center gap-2">
              <button onClick={() => chatFileInputRef.current?.click()} className="text-gray-400 hover:text-blue-400">📎</button>
              <input type="file" hidden ref={chatFileInputRef} onChange={handleChatFileUpload} accept="image/*,video/*" />
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type..." 
                  className="w-full bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white focus:outline-none"
                />
                <button onClick={() => setShowChatEmoji(!showChatEmoji)} className="absolute right-2 top-1 text-gray-400 hover:text-yellow-400 text-xs">😊</button>
              </div>
              <button onClick={sendChatMessage} className="p-1.5 bg-blue-600 rounded-full text-xs">🚀</button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}