import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Add response headers for caching and security
    const headers = new Headers({
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
    });

    return NextResponse.json({ message: 'Hello, from API!', timestamp: new Date().toISOString() }, { headers });
  } catch (error) {
    // Proper error handling
    console.error('Error in /api/hello:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { headers: { 'Content-Type': 'application/json' }, status: 500 },
    );
  }
}
