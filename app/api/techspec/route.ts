import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://docs.google.com/document/d/1VWUq9CXcJSLSt7VpVxTC4vYuxLK-Sx3Ipv4yZHODxaY/edit?usp=sharing');
}