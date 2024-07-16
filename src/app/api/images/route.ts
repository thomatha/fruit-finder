import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const filename = uuidv4();
  const contentType = request.headers.get('content-type');
  const blob = await put(filename, request.body, {
    access: 'public',
    contentType,
  });
  return NextResponse.json(blob);
}
