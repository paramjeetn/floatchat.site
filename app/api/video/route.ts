import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://drive.google.com/file/d/16g3LBytb-yKig8dcgVDurxoG7yp3rfFl/view?usp=sharing');
}