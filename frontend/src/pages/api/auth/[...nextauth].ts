import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        const credential = GoogleAuthProvider.credential(account.id_token, account.access_token);
        const userCredential = await signInWithCredential(auth, credential);
        const firebaseToken = await userCredential.user.getIdToken(true);   // Firebase ID Token 생성
        token.firebaseToken = firebaseToken;                                // Firebase ID Token 추가;
      }
      return token;
    },
    async session({ session, token }) {
      session.firebaseToken = token.firebaseToken as string;                // Firebase ID Token
      return session;
    },
  },
});
