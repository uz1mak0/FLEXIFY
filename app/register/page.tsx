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
    <section className="showcase relative min-h-screen flex justify-center items-start bg-gray-100 dark:bg-gray-900 pt-8 pb-8">
      <video
        src="/star.mp4"
        muted
        loop
        autoPlay
        className="fixed top-0 left-0 w-full h-full object-cover"
      />

      <div className="w-full max-w-md flex flex-col items-center justify-start relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-widest text-white mb-2" style={{ fontFamily: "'Bitcount Prop Single Ink', sans-serif" }}>
            FLEXIFY
          </h1>
          <h2 className="text-2xl font-semibold text-gray-300">Create your Account</h2>
        </div>

        <div className="w-full bg-white/10 dark:bg-gray-900/40 frosted-glass border border-white/20 dark:border-gray-700/50 rounded-lg shadow-2xl p-6">
          <h3 className="text-4xl font-extrabold tracking-wider text-white mb-6 text-center" style={{ fontFamily: "'Bitcount Prop Single Ink', sans-serif" }}>
            FLEXIFY
          </h3>

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
  );
}
