import otpGenerator from 'otp-generator';

// In-memory OTP storage (for production, use Redis or database)
// Format: { email: { otp: '123456', expiresAt: timestamp } }
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// OTP expiry time in minutes
const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = (): string => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });
};

/**
 * Store OTP for a user email
 * @param {string} email - User email
 * @param {string} otp - Generated OTP
 */
export const storeOTP = (email: string, otp: string): void => {
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

  otpStore.set(email, {
    otp,
    expiresAt
  });

  // Auto-delete OTP after expiry
  setTimeout(() => {
    otpStore.delete(email);
    console.log(`OTP expired for ${email}`);
  }, OTP_EXPIRY_MINUTES * 60 * 1000);
};

/**
 * Verify OTP for a user email
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 * @returns {boolean} True if OTP is valid and not expired
 */
export const verifyOTP = (email: string, otp: string): boolean => {
  const storedData = otpStore.get(email);

  if (!storedData) {
    console.log(`No OTP found for ${email}`);
    return false;
  }

  // Check if OTP has expired
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    console.log(`OTP expired for ${email}`);
    return false;
  }

  // Verify OTP
  const isValid = storedData.otp === otp;

  if (isValid) {
    console.log(`OTP verified successfully for ${email}`);
  } else {
    console.log(`Invalid OTP for ${email}`);
  }

  return isValid;
};

/**
 * Get email associated with stored OTP
 * @param {string} email - User email
 * @returns {boolean} True if OTP exists for email
 */
export const getOTPEmail = (email: string): boolean => {
  return otpStore.has(email);
};

/**
 * Clear OTP for a user email
 * @param {string} email - User email
 */
export const clearOTP = (email: string): void => {
  otpStore.delete(email);
  console.log(`OTP cleared for ${email}`);
};

/**
 * Get OTP info (for debugging only)
 * @param {string} email - User email
 * @returns {object|null} OTP data or null
 */
export const getOTPInfo = (email: string) => {
  return otpStore.get(email) || null;
};
