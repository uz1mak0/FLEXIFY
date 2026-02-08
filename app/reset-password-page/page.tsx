'use client';

import { FormEvent, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    { label: 'At least 8 characters', regex: /.{8,}/, met: false },
    { label: 'At least one uppercase letter', regex: /[A-Z]/, met: false },
    { label: 'At least one lowercase letter', regex: /[a-z]/, met: false },
    { label: 'At least one number', regex: /\d/, met: false },
    {
      label: 'At least one special character',
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      met: false
    }
  ]);

  // Initialize with email and OTP verification
  useEffect(() => {
    const resetEmail = sessionStorage.getItem('resetEmail');
    const verifiedOTP = sessionStorage.getItem('verifiedOTP');

    if (!resetEmail || !verifiedOTP) {
      router.push('/forgetpassword');
    } else {
      setEmail(resetEmail);
    }
  }, [router]);

  const checkPasswordStrength = (pwd: string) => {
    const newRequirements = requirements.map((req) => ({
      ...req,
      met: req.regex.test(pwd)
    }));

    setRequirements(newRequirements);

    const metCount = newRequirements.filter((r) => r.met).length;

    if (pwd.length === 0) {
      setPasswordStrength('');
    } else if (metCount < 2) {
      setPasswordStrength('weak');
    } else if (metCount < 4) {
      setPasswordStrength('fair');
    } else if (metCount < 5) {
      setPasswordStrength('good');
    } else {
      setPasswordStrength('strong');
    }

    return metCount === 5;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    checkPasswordStrength(pwd);
    if (pwd) {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const pwd = e.target.value;
    setConfirmPassword(pwd);

    if (password && pwd !== password) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }

    const isValid = checkPasswordStrength(password);
    if (!isValid) {
      setPasswordError('Password does not meet all requirements');
      return;
    }

    setIsLoading(true);

    try {
      const verifiedOTP = sessionStorage.getItem('verifiedOTP');
      const response = await fetch('/api/set-new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otp: verifiedOTP,
          newPassword: password
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);

        setTimeout(() => {
          sessionStorage.removeItem('resetEmail');
          sessionStorage.removeItem('verifiedOTP');
          router.push('/');
        }, 2000);
      } else {
        setPasswordError(data.message || 'Failed to reset password. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setPasswordError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'fair':
        return 'bg-orange-500';
      case 'good':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'w-1/4';
      case 'fair':
        return 'w-2/4';
      case 'good':
        return 'w-3/4';
      case 'strong':
        return 'w-full';
      default:
        return 'w-0';
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
          <h1 
                className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg"
                style={{ 
                  fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', sans-serif",
                  textShadow: '0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)'
                }}
              >
                FLEXIFY
          </h1>
          <p className="text-gray-300 text-sm">Set New Password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              disabled
              value={email}
              className="appearance-none relative block w-full px-4 py-3 border border-white/30 dark:border-gray-600 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none transition duration-200 opacity-60"
              placeholder="Email Address"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                value={password}
                onChange={handlePasswordChange}
                className="login-input appearance-none relative block w-full px-4 py-3 border border-white/30 dark:border-gray-600 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                placeholder="New Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>

            <div className="h-1 bg-gray-400 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
              />
            </div>

            {passwordError && (
              <p className="text-red-400 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          <div className="bg-black/20 rounded-lg p-3 space-y-2">
            <p className="text-gray-400 text-xs font-semibold mb-2">
              Password Requirements:
            </p>
            {requirements.map((req, index) => (
              <div
                key={index}
                className={`flex items-center text-sm ${
                  req.met ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 border-current flex items-center justify-center mr-2 text-xs font-bold ${
                    req.met ? 'bg-green-500 border-green-500 text-white' : ''
                  }`}
                >
                  {req.met && '✓'}
                </div>
                <span>{req.label}</span>
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="login-input appearance-none relative block w-full px-4 py-3 border border-white/30 dark:border-gray-600 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              placeholder="Confirm Password"
            />
            {confirmError && (
              <p className="text-red-400 text-sm mt-1">{confirmError}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center p-3 px-4 border border-transparent text-lg font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-300">
            <Link
              href="/"
              className="font-medium text-blue-400 hover:text-blue-300 transition duration-150"
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
            <p className="text-xl font-semibold text-white tracking-wider mb-2">
              Password Reset!
            </p>
            <p className="text-gray-300 text-sm">
              Your password has been reset successfully.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
