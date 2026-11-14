import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/assistant', '/cooperative', '/admin'];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function redirectWithCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  error?: string,
  redirectTo?: string
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  if (error) url.searchParams.set('error', error);
  if (redirectTo) url.searchParams.set('redirectTo', redirectTo);

  const redirectResponse = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return redirectWithCookies(request, NextResponse.next({ request }), '/login', 'supabase_not_configured');
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return redirectWithCookies(
      request,
      response,
      '/login',
      undefined,
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
  }

  let allowedRoles: string[] | null = null;
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    allowedRoles = ['super_admin'];
  } else if (request.nextUrl.pathname === '/cooperative' || request.nextUrl.pathname.startsWith('/cooperative/')) {
    allowedRoles = ['cooperative_admin', 'organization_admin', 'super_admin'];
  }

  if (allowedRoles) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      return redirectWithCookies(request, response, '/login', 'profile_setup_incomplete');
    }

    if (!profile || !allowedRoles.includes(profile.role)) {
      return redirectWithCookies(request, response, '/dashboard');
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/assistant/:path*', '/cooperative/:path*', '/admin/:path*'],
};
