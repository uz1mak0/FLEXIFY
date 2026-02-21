'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && validateEmail(value)) {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.redirect) {
        setTimeout(() => {
          router.push(data.redirect);
        }, 500);
      } else {
        alert('Login failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
  <>
    <div className="h-screen flex flex-col overflow-hidden">
      <video
        src="/star.mp4"
        muted
        loop
        autoPlay
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      />
      
      <section className="flex-grow flex justify-center items-center relative z-10 px-4">
        <div className="w-full max-w-sm bg-white/10 dark:bg-gray-900/40 frosted-glass border border-white/20 dark:border-gray-700/50 rounded-xl shadow-2xl p-6 md:p-8 text-white">
          <div className="text-center mb-6">
            <h1 
              className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg"
              style={{ 
                fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', sans-serif",
                textShadow: '0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)'
              }}
            >
              FLEXIFY
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className="login-input appearance-none relative block w-full px-4 py-3 border-2 border-white/40 dark:border-gray-500 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
                placeholder="Email Address"
              />
              {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input appearance-none relative block w-full px-4 py-3 border-2 border-white/40 dark:border-gray-500 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
                placeholder="Password"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgetpassword" size-sm className="text-xs font-medium text-blue-400 hover:text-blue-300">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center p-3 border border-transparent text-md font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs">
            <p className="text-gray-300">
              Don't have an account?
              <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300 ml-1">
                Sign up here!
              </Link>
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 text-gray-300 py-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold text-white tracking-tight">
              <span className="text-blue-400">FLEXIFY</span>
            </h2>
            <p className="text-xs text-gray-400 leading-tight mt-1">
              Next-gen Social Media platform
            </p>
          </div>

          <div className="flex justify-center gap-6 text-xs font-medium">
            <Link href="/features" className="hover:text-blue-400 transition">Features</Link>
            <Link href="/privacy" className="hover:text-blue-400 transition">Privacy</Link>
          </div>

          <div className="flex flex-col md:items-end items-center gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📧</span>
              <span>support@flexify.io</span>
            </div>
            <p className="text-gray-500 text-[10px]">© {new Date().getFullYear()} Flexify Labs</p>
          </div>
        </div>
      </footer>
    </div>
  </>
  );
}
