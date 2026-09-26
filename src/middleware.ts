import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// Routes that require authentication
const protectedRoutes = [
  '/locataire',
  '/proprietaire',
  '/gestion',
];

// Routes that require specific roles
const roleRoutes: Record<string, UserRole[]> = {
  '/locataire': ['TENANT', 'ADMIN'],
  '/proprietaire': ['OWNER', 'ADMIN'],
  '/gestion': ['AGENT', 'ADMIN'],
};

// Routes to redirect authenticated users away from
const authRoutes = ['/connexion', '/inscription', '/mot-de-passe-oublie'];

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Check if user is authenticated
  const isAuthenticated = !!req.auth;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/logements', nextUrl));
  }

  // Check protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return NextResponse.redirect(new URL(`/connexion?callbackUrl=${callbackUrl}`, nextUrl));
  }

  // Check role-based access
  if (isAuthenticated && isProtectedRoute) {
    const userRole = req.auth?.user?.role;
    
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route) && userRole && !allowedRoles.includes(userRole as UserRole)) {
        return NextResponse.redirect(new URL('/logements', nextUrl));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
