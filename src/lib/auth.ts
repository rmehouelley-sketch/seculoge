import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { UserRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
}

declare module 'next-auth' {
  interface User extends AuthUser {}
  interface Session {
    user: AuthUser;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    avatarUrl?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/connexion',
    error: '/connexion',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Mot de passe incorrect');
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          avatarUrl: user.avatarUrl || undefined,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.role = user.role;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          firstName: token.firstName,
          lastName: token.lastName,
          phone: token.phone,
          role: token.role,
          avatarUrl: token.avatarUrl,
          emailVerified: false,
          phoneVerified: false,
        };
      }
      return session;
    },
  },
});

// Helper to get current user in server components
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

// Helper to check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Helper to check user role
export async function hasRole(role: UserRole | UserRole[]) {
  const user = await getCurrentUser();
  if (!user) return false;
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
}

// Middleware to protect routes
export function protectRoute(allowedRoles?: UserRole[]) {
  return async function (request: Request) {
    const user = await getCurrentUser();
    
    if (!user) {
      // Redirect to login
      const url = new URL('/connexion', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return Response.redirect(url);
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to home or appropriate page
      return Response.redirect(new URL('/', request.url));
    }

    return null;
  };
}
