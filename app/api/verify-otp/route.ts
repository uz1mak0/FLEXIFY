import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = verifyOTP(email, otp);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully. Proceed to reset password.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, message: 'OTP verification failed' },
      { status: 500 }
    );
  }
}
