'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePasswordMatch = () => {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordMatchMessage('❌ Passwords do not match');
        return false;
      } else {
        setPasswordMatchMessage('✅ Passwords match');
        return true;
      }
    } else {
      setPasswordMatchMessage('');
      return true;
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword) {
      validatePasswordMatch();
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    validatePasswordMatch();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('❌ Passwords do not match. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.success && data.redirect) {
        setTimeout(() => {
          router.push(data.redirect);
        }, 500);
      } else if (data.message) {
        alert(data.message);
        setIsLoading(false);
      } else {
        alert('Registration failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <section className="showcase relative flex-grow flex justify-center items-center bg-gray-100 dark:bg-gray-900 py-8">
        <video
          src="/star.mp4"
          muted
          loop
          autoPlay
          className="fixed top-0 left-0 w-full h-full object-cover"
        />

        <div className="w-full max-w-md flex flex-col items-center justify-center relative z-10">
          <div className="w-full bg-white/10 dark:bg-gray-900/40 frosted-glass border border-white/20 dark:border-gray-700/50 rounded-lg shadow-2xl p-6">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <h1
                className="text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg"
                style={{
                  fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', sans-serif",
                  textShadow: '0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)'
                }}
              >
                FLEXIFY
              </h1>
              <div className="mt-2 h-0.5 w-32 mx-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-60"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">
                  User name
                </label>
                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login-input appearance-none relative block w-full px-4 py-3 border border-white/30 dark:border-gray-600 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  placeholder="User Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input appearance-none relative block w-full px-4 py-3 border border-white/30 dark:border-gray-600 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  placeholder="Email Address"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="login-input appearance-none relative block w-full px-4 py-3 pr-12 border border-white/30 dark:border-gray-600 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition duration-150 focus:outline-none"
                >
                  {showPassword ? '⦿' : '☉'}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="login-input appearance-none relative block w-full px-4 py-3 pr-12 border border-white/30 dark:border-gray-600 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition duration-150 focus:outline-none"
                >
                  {showConfirmPassword ? '⦿' : '☉'}
                </button>
              </div>

              {passwordMatchMessage && (
                <div
                  className={`text-sm font-semibold mt-2 ${
                    passwordMatchMessage.includes('do not') ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {passwordMatchMessage}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center p-3 px-4 border border-transparent text-lg font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="ml-2">Signing up...</span>
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-300">
                Already have an account?
                <Link
                  href="/"
                  className="font-medium text-blue-400 hover:text-blue-300 transition duration-150 ml-1"
                >
                  Sign in here!
                </Link>
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 z-50 bg-gray-900/90 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300">
            <div className="loader-content flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 animate-ping absolute" />
              <div className="w-16 h-16 rounded-full bg-blue-600 opacity-75" />
              <p className="mt-8 text-xl font-semibold text-white tracking-wider">FLEXIFY</p>
            </div>
          </div>
        )}
      </section>

      <footer className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 text-gray-300 py-4">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold text-white tracking-tight">
              <span className="text-blue-400">FLEXIFY</span>
            </h2>
            <p className="text-[10px] text-gray-400 leading-tight">
              Next-gen Social Media platform.
            </p>
          </div>

          <div className="flex justify-center gap-6 text-xs font-medium">
            <Link href="/features" className="hover:text-blue-400 transition">Features</Link>
            <Link href="/privacy" className="hover:text-blue-400 transition">Privacy</Link>
          </div>

          <div className="flex flex-col md:items-end items-center gap-1 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📧</span>
              <span>support@flexify.io</span>
            </div>
            <p className="text-gray-500">© {new Date().getFullYear()} Flexify Labs</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
