import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('admin_token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/login';

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};