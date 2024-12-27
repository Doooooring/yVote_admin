import { HOST_URL } from '@asset';
import { CommonError } from '@interface/err';
import { authRepositories } from '@repositories/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware is running! Pathname:', req.nextUrl.pathname);

  const curUrl = req.nextUrl.pathname;
  const prevUrl = req.headers.get('referer') || 'NO_REFERER';

  if (prevUrl !== `${HOST_URL}/validation-check`) {
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/news/:path*', '/keyword/:path*'],
};
