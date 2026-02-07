import { NextRequest, NextResponse } from 'next/server';
import { mockPosts } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const rankedPosts = [...mockPosts].sort((a, b) => b.weight - a.weight);

    return NextResponse.json(rankedPosts.slice(startIndex, endIndex), {
      status: 200
    });
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
