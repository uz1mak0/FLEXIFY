import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, clearOTP } from '@/lib';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify OTP one more time
    const isValid = verifyOTP(email, otp);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // TODO: Hash password and update in database
    // Example: await updateUserPassword(email, hashedPassword);

    console.log(`Password reset for ${email}`);

    // Clear OTP after successful password reset
    clearOTP(email);

    return NextResponse.json(
      { success: true, message: 'Password has been reset successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
