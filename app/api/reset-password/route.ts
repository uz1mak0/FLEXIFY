import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib';
import { sendOTPEmail } from '@/lib';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with email
    storeOTP(email, otp);

    // Send OTP via email
    await sendOTPEmail(email, otp);

    console.log(`OTP sent to ${email}. OTP: ${otp}`);

    return NextResponse.json(
      { success: true, message: 'OTP has been sent to your email.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send OTP. Please try again later.'
      },
      { status: 500 }
    );
  }
}
