import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Auth.js requires a secret in production; this dev fallback prevents local crashes
  // when `.env.local` has not been configured yet.
  secret:
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === 'development'
      ? 'local-dev-auth-secret-change-me'
      : undefined),
  providers: [
    Google({
      clientId:
        process.env.GOOGLE_CLIENT_ID?.trim() ??
        process.env.AUTH_GOOGLE_ID?.trim(),
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET?.trim() ??
        process.env.AUTH_GOOGLE_SECRET?.trim(),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GitHub({
      clientId:
        process.env.GITHUB_CLIENT_ID?.trim() ??
        process.env.AUTH_GITHUB_ID?.trim(),
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET?.trim() ??
        process.env.AUTH_GITHUB_SECRET?.trim(),
      // Some GitHub OAuth app setups fail with PKCE; state-only is enough here.
      checks: ['state'],
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        provider: token.provider,
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})
