import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${API_URL}/api/users/`,
     {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}
