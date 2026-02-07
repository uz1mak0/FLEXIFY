'use client';

import { FormEvent, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyOTPPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize with email from session storage
  useEffect(() => {
    const resetEmail = sessionStorage.getItem('resetEmail');
    if (!resetEmail) {
      router.push('/forgetpassword');
    } else {
      setEmail(resetEmail);
    }

    // Focus first input
    setTimeout(() => {
      otpInputsRef.current[0]?.focus();
    }, 100);

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [router]);

  // Timer effect
  useEffect(() => {
    timerIdRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIdRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Enable resend after 30 seconds
    const resendTimer = setTimeout(() => {
      setCanResend(true);
    }, 30000);

    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      clearTimeout(resendTimer);
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft === 0;

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Clear error on input
    if (otpError) {
      setOtpError('');
    }

    // Auto focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 6);

    const newOtpValues = [...otpValues];
    pastedDigits.split('').forEach((digit, i) => {
      if (i < 6) {
        newOtpValues[i] = digit;
      }
    });

    setOtpValues(newOtpValues);

    if (pastedDigits.length === 6) {
      otpInputsRef.current[5]?.blur();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otp = otpValues.join('');

    if (otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('verifiedOTP', otp);
        setShowSuccess(true);

        setTimeout(() => {
          router.push('/reset-password-page');
        }, 2000);
      } else {
        setOtpError(data.message || 'Invalid or expired OTP. Please try again.');
        setOtpValues(['', '', '', '', '', '']);
        otpInputsRef.current[0]?.focus();
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setOtpError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      const data = await response.json();

      if (data.success) {
        setOtpValues(['', '', '', '', '', '']);
        setOtpError('');
        setTimeLeft(600);

        otpInputsRef.current[0]?.focus();

        // Reset timer
        if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
        }

        timerIdRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerIdRef.current) clearInterval(timerIdRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Enable resend after 30 seconds
        setTimeout(() => {
          setCanResend(true);
        }, 30000);
      } else {
        setOtpError('Failed to resend OTP. Please try again.');
        setCanResend(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setOtpError('An error occurred. Please try again.');
      setCanResend(true);
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
          <p className="text-gray-300 text-sm">Verify OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <p className="text-gray-300 text-sm">
              Enter the 6-digit OTP sent to your email.
            </p>
          </div>

          <div>
            <label htmlFor="otp-display" className="sr-only">
              Email
            </label>
            <input
              type="text"
              id="otp-display"
              disabled
              value={email}
              className="appearance-none relative block w-full px-4 py-3 border border-white/30 dark:border-gray-600 rounded-lg bg-black/30 placeholder-gray-400 text-white focus:outline-none transition duration-200 mb-4 text-sm"
              placeholder="Email"
            />
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-3 text-center">Enter OTP</p>
            <div className="flex justify-center gap-2 mb-4">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputsRef.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  aria-label={`OTP digit ${index + 1}`}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isExpired || isLoading}
                  className={`w-12 h-12 text-2xl text-center font-bold border-2 rounded-lg bg-black/30 text-white transition-all duration-200 focus:outline-none ${
                    value
                      ? 'bg-blue-400/20 border-blue-400'
                      : 'border-white/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50'
                  } ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              ))}
            </div>
            {otpError && (
              <p className="text-red-400 text-sm mt-1 text-center">{otpError}</p>
            )}
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              OTP expires in{' '}
              <span
                className={`${
                  isExpired ? 'text-red-500' : 'text-yellow-500'
                } font-semibold`}
              >
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || isExpired}
              className="group relative w-full flex justify-center p-3 px-4 border border-transparent text-lg font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm space-y-2">
          <p className="text-gray-300">
            Didn't receive the OTP?
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className="font-medium text-blue-400 hover:text-blue-300 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed ml-1"
            >
              Resend OTP
            </button>
          </p>
          <p className="text-gray-300">
            <Link
              href="/forgetpassword"
              className="font-medium text-blue-400 hover:text-blue-300 transition duration-150"
            >
              Back to Forgot Password
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
              OTP Verified!
            </p>
            <p className="text-gray-300 text-sm">Redirecting to password reset page...</p>
          </div>
        </div>
      )}
    </section>
  );
}
