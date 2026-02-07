'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('resetEmail', email);
        setShowSuccess(true);

        setTimeout(() => {
          router.push('/verify-otp');
        }, 3000);
      } else {
        alert(data.message || 'Failed to send OTP. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <section className="showcase relative min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <video
        src="/star.mp4"
        muted
        loop
        autoPlay
        className="fixed top-0 left-0 w-full h-full object-cover"
      />

      <div className="w-full max-w-sm bg-white/10 dark:bg-gray-900/40 frosted-glass border border-white/20 dark:border-gray-700/50 rounded-xl shadow-2xl p-6 md:p-8 text-white relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-widest text-white mb-2" style={{ fontFamily: "'Bitcount Prop Single Ink', sans-serif" }}>
            FLEXIFY
          </h1>
          <p className="text-gray-300 text-sm">Reset Your Password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <p className="text-gray-300 text-sm">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
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
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className="login-input appearance-none relative block w-full px-4 py-3 border border-white/30 dark:border-gray-600 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              placeholder="Email Address"
            />
            {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center p-3 px-4 border border-transparent text-lg font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-300">
            Remember your password?
            <Link
              href="/"
              className="font-medium text-blue-400 hover:text-blue-300 transition duration-150 ml-1"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-gray-900/90 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300">
          <div className="success-content flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-white tracking-wider mb-2">Success!</p>
            <p className="text-gray-300 text-sm">Check your email for the OTP.</p>
          </div>
        </div>
      )}
    </section>
  );
}
