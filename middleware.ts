import { CommonError } from '@interface/err';
import { authRepositories } from '@repositories/auth';
import { NextRequest, NextResponse } from 'next/server';

const protectedurl = ['/news', '/keyword'];

export async function middleware(req: NextRequest) {
  console.log('Middleware is running! Pathname:', req.nextUrl.pathname);

  if (protectedurl.includes(req.nextUrl.pathname)) {
    console.log('is try');
    try {
      const response = await authRepositories.checkAuthSession();
      if (!response) throw Error(CommonError.UNAUTHORIZATION);
    } catch (e) {
      console.log(e);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}
