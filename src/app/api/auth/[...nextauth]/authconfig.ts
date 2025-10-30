import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { NEXTAUTH_SECRET } from "@/configs/settings";
import API from "@/lib/axios-client";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
      httpOptions: {
        timeout: 10000, // increase to 10s
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, account, user }) {
      // Only set id_token on initial Google login
      if (account?.provider === "google" && account.id_token) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id_token: token.id_token,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      try {
        // const fullUrl = url.startsWith("http")
        //   ? new URL(url)
        //   : new URL(url, baseUrl);
        // const isCallback = fullUrl.pathname.startsWith("/api/auth/callback");
        // console.log("IsCallBack : ",isCallback);

        // if (isCallback) {
        //   // After OAuth → send to checking page
        //   return `${baseUrl}/auth/redirecting`;
        // }

        // return fullUrl.toString();

        return `${baseUrl}/redirecting`; // send all logins to redirecting page
      } catch (e) {
        console.error("Redirect error:", e);
        return baseUrl;
      }
    },
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  secret: NEXTAUTH_SECRET,
};
