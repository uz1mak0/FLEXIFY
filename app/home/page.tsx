'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib';

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

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
    <section className="showcase relative min-h-screen flex justify-center items-start bg-gray-100 dark:bg-gray-900">
      <video
        src="/star.mp4"
        muted
        loop
        autoPlay
        className="fixed top-0 left-0 w-full h-full object-cover"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-8 z-30 flex justify-between items-center">
        <div
          className="text-white text-3xl font-bold tracking-widest"
          style={{ fontFamily: "'Bitcount Prop Single Ink', sans-serif" }}
        >
          FLEXIFY
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white text-2xl hover:bg-white/10 rounded-full transition duration-200 z-40"
          >
            ⋯
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white/10 dark:bg-gray-900/40 frosted-glass border border-white/20 dark:border-gray-700/50 rounded-lg shadow-xl py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-sm font-semibold text-white hover:bg-red-600/80 hover:bg-red-600 transition duration-200 text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content relative z-10 w-full flex flex-col items-center pt-20 p-4 space-y-6">
        {/* Create Post Widget */}
        <div className="w-full max-w-xl bg-white/10 dark:bg-gray-900/40 frosted-glass border border-white/20 dark:border-gray-700/50 rounded-lg shadow-xl p-4">
          <div className="flex items-center space-x-3 mb-3 border-b border-white/10 dark:border-gray-600/50 pb-3">
            <div className="flex-1 bg-white/5 dark:bg-black/20 p-2 rounded-full text-white dark:text-gray-300 hover:bg-white/10 dark:hover:bg-black/30 transition duration-150 cursor-pointer">
              Share your thoughts?
            </div>
          </div>

          <div className="flex justify-around text-sm font-semibold text-white dark:text-gray-300">
            <button className="flex items-center space-x-1 hover:text-green-400 transition">
              <span>🖼️</span>
              <span>Photo/Video</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-yellow-400 transition">
              <span>😊</span>
              <span>Feeling</span>
            </button>
          </div>
        </div>

        {/* Feed */}
        <div id="post-feed" className="w-full max-w-xl space-y-4">
          {posts.map(renderPost)}
        </div>

        {/* Loading Sentinel */}
        <div
          ref={sentinelRef}
          className="h-20 flex justify-center items-center w-full max-w-xl"
        >
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          )}
          {!hasMore && (
            <p className="text-gray-500">No more posts to show.</p>
          )}
        </div>
      </div>
    </section>
  );
}
