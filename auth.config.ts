import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Resetting this since we're not enforcing auth right now anyway
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      // Temporarily bypass all authentication checks
      return true;
    },
  },
} satisfies Omit<NextAuthConfig, 'providers'>;
