import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
 try {
  return NextResponse.json([], {status: 200 });
 } catch (error) {
  console.error('Feed error:', error);
  return NextResponse.json(
      {
        success: false, message: 'Failed to fetch' 
      },
      {
        status: 500
      }
    )
 }
}
