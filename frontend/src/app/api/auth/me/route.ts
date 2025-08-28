import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL;

export async function GET(req: NextRequest) {
  const token = cookies().get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_URL}/api/users/me`,
     {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ detail: 'Failed to fetch user' }, { status: response.status });
    }

    const user = await response.json();
    return NextResponse.json(user);

  } catch (error) {
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}
