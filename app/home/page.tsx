'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib';
import Navbar from '@/app/navbar/page';
import Link from 'next/link';
import UserProfile from '@/app/userProfile/page';

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showFeelingModal, setShowFeelingModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [ showChat, setShowChat ] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  const emojis = ['😀', '😂', '😍', '😢', '😎', '🎉', '👍', '♥️', '🔥', '✨', '😡', '😱', '🤔', '😴', '🙏', '💪', '🎊', '💯'];

  const feelings = [
    '😊 Happy', '😢 Sad', '😠 Angry', '😴 Tired', '😍 Loved',
    '🤔 Thoughtful', '😎 Cool', '🤗 Grateful', '😱 Shocked', '😌 Peaceful'
  ];

  const activities = [
    '🏃 Working out', '🍕 Eating', '🎮 Gaming', '🏠 At home',
    '🚗 Traveling', '📚 Reading', '🎬 Watching', '🎵 Listening to music', '☕ Drinking coffee', '🛌 Sleeping'
  ];

  const loadFeed = useCallback(async (pageNum: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/feed?page=${pageNum}`);
      const newPosts: Post[] = await response.json();

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
    } catch (err) {
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadFeed(page);
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [page, loading, hasMore, loadFeed]);

  // Initial load
  useEffect(() => {
    loadFeed(1);
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  const renderPost = (post: Post) => (
    <div
      key={`${post.id}-${post.author}`}
      className="bg-white/10 frosted-glass border border-white/20 rounded-xl p-4 text-white transition-all hover:bg-white/15"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
          {post.author[0]}
        </div>
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
          <video
            src="/star.mp4"
            muted
            loop
            autoPlay
            className="fixed top-0 left-0 w-full h-full object-cover"
          />

          {/* Navbar */}
          <Navbar
            onProfileClick={() => setShowProfileModal(true)}
            onLogout={handleLogout}
            onChatClick={toggleChat}
          />

          {/* Profile Modal */}
          <UserProfile
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
          />

          {/* Main Content */}
          <div className="main-content relative z-10 w-full flex flex-col items-center pt-32 p-4 space-y-6">
            {/* Create Post Widget */}
            <div className="w-full max-w-xl bg-white/10 dark:bg-gray-900/40 frosted-glass border border-white/20 dark:border-gray-700/50 rounded-lg shadow-xl p-4">
              <div className="flex items-center space-x-3 mb-3 border-b border-white/10 dark:border-gray-600/50 pb-3">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowCreateModal(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowCreateModal(true); }}
                  className="flex-1 bg-white/5 dark:bg-black/20 p-2 rounded-full text-white dark:text-gray-300 hover:bg-white/10 dark:hover:bg-black/30 transition duration-150 cursor-pointer"
                >
                  Share your thoughts?
                </div>
              </div>

              {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-black/60"
                    onClick={() => setShowCreateModal(false)}
                  />

                  <div className="relative w-full max-w-xl bg-white/95 dark:bg-gray-900/95 frosted-glass border border-white/20 rounded-lg p-6 z-60">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Create Post</h3>
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full min-h-[120px] p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="What's on your mind?"
                    />

                    {showEmojiPicker && (
                      <div className="mt-3 p-3 bg-white/10 dark:bg-black/20 rounded-md border border-white/20">
                        <div className="grid grid-cols-9 gap-2">
                          {emojis.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                setNewContent((prev) => prev + emoji);
                              }}
                              className="text-xl hover:scale-125 transition duration-150 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-xl hover:scale-110 transition duration-150 cursor-pointer"
                        title="Add emoji"
                      >
                        😊
                      </button>

                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => { setShowCreateModal(false); setNewContent(''); setShowEmojiPicker(false); }}
                          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newContent.trim()) return;
                            const newPost: Post = {
                              id: Date.now(),
                              author: 'You',
                              time: 'Just now',
                              content: newContent.trim(),
                              likes: 0,
                              weight: 0
                            };
                            setPosts((prev) => [newPost, ...prev]);
                            setNewContent('');
                            setShowCreateModal(false);
                            setShowEmojiPicker(false);
                          }}
                          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-around text-sm font-semibold text-white dark:text-gray-300">
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="flex items-center space-x-1 hover:text-green-400 transition"
                >
                  <span>🖼️</span>
                  <span>Photo/Video</span>
                </button>
              </div>
            </div>

            {/* Photo/Video Upload Modal */}
            {showPhotoModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => { setShowPhotoModal(false); setUploadedFiles([]); }}
                />

                <div className="relative w-full max-w-xl bg-white/95 dark:bg-gray-900/95 frosted-glass border border-white/20 rounded-lg p-6 z-60">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Photos or Videos</h3>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        setUploadedFiles(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-blue-400 rounded-lg text-white hover:bg-white/5 transition flex flex-col items-center justify-center"
                  >
                    <span className="text-3xl mb-2">📁</span>
                    Click to upload or drag files here
                  </button>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Selected: {uploadedFiles.length} file(s)
                      </p>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white/10 dark:bg-black/20 p-2 rounded text-sm text-gray-900 dark:text-white"
                          >
                            <span>{file.name}</span>
                            <button
                              onClick={() =>
                                setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))
                              }
                              className="text-red-500 hover:text-red-400 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => { setShowPhotoModal(false); setUploadedFiles([]); }}
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (uploadedFiles.length === 0) return;
                        const fileNames = uploadedFiles.map(f => f.name).join(', ');
                        const newPost: Post = {
                          id: Date.now(),
                          author: 'You',
                          time: 'Just now',
                          content: `📸 Shared ${uploadedFiles.length} file(s): ${fileNames}`,
                          likes: 0,
                          weight: 0
                        };
                        setPosts((prev) => [newPost, ...prev]);
                        setUploadedFiles([]);
                        setShowPhotoModal(false);
                      }}
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Feeling/Activity Modal */}
            {showFeelingModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => { setShowFeelingModal(false); setSelectedFeeling(null); }}
                />

                <div className="relative w-full max-w-md bg-white/95 dark:bg-gray-900/95 frosted-glass border border-white/20 rounded-lg p-6 z-[101] max-h-[85vh] flex flex-col shadow-2xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How are you feeling?</h3>

                  <div className="overflow-y-auto flex-1 pr-2">
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {feelings.map((feeling) => (
                        <button
                          key={feeling}
                          onClick={() => setSelectedFeeling(feeling)}
                          className={`p-3 rounded-lg text-sm font-semibold transition ${
                            selectedFeeling === feeling
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 dark:bg-black/20 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-black/30'
                          }`}
                        >
                          {feeling}
                        </button>
                      ))}
                    </div>

                    <hr className="border-white/20 my-4" />

                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">What are you doing?</h4>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {activities.map((activity) => (
                        <button
                          key={activity}
                          onClick={() => setSelectedFeeling(activity)}
                          className={`p-3 rounded-lg text-sm font-semibold transition ${
                            selectedFeeling === activity
                              ? 'bg-yellow-600 text-white'
                              : 'bg-white/10 dark:bg-black/20 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-black/30'
                          }`}
                        >
                          {activity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-white/20">
                    <button
                      type="button"
                      onClick={() => { setShowFeelingModal(false); setSelectedFeeling(null); }}
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedFeeling) return;
                        const newPost: Post = {
                          id: Date.now(),
                          author: 'You',
                          time: 'Just now',
                          content: `${selectedFeeling}`,
                          likes: 0,
                          weight: 0
                        };
                        setPosts((prev) => [newPost, ...prev]);
                        setSelectedFeeling(null);
                        setShowFeelingModal(false);
                      }}
                      className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-500"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Feed */}
            <div id="post-feed" className="w-full max-w-xl space-y-4">
              {posts.map(renderPost)}
            </div>

            {/* Loading Sentinel */}
            <div
              ref={sentinelRef}
              className="h-20 w-full flex items-center justify-center"
            >
              {loading && (
                <div className="flex items-center space-x-2 text-white">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <p className="text-white/60 text-sm">You've reached the end!</p>
              )}
            </div>
          </div>

          {/* Floating Chat Window */}
              {showChat && (
                <div className="fixed bottom-24 left-6 z-[100] w-80 h-96 bg-gray-900/90 frosted-glass border border-white/20 rounded-xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5">
                  {/* Header */}
                  <div className="p-3 border-b border-white/10 flex justify-between items-center bg-blue-600/30 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-bold text-sm">Messages</span>
                    </div>
                    <button 
                      onClick={() => setShowChat(false)}
                      className="text-gray-400 hover:text-white transition text-lg"
                    >
                      ×
                    </button>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-grow p-4 overflow-y-auto text-sm space-y-3 custom-scrollbar">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-gray-200 self-start max-w-[80%]">
                      Welcome to the Flexify chat!
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-3 border-t border-white/10">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="w-full bg-black/40 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <button className="absolute right-3 top-1.5 text-blue-400 hover:text-blue-300">
                        🚀
                      </button>
                    </div>
                  </div>
                </div>
              )}
        </section>  
    </>
  );
}
