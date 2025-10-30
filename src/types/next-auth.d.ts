// types/next-auth.d.ts
// types/next-auth.d.ts
import NextAuth from 'next-auth'; 

declare module 'next-auth' {
  interface Session {
    user: User;
    expires: string;
  }

  interface User {
    id: string;
    id_token?: unknown;
    role: 'user' | 'partner' | 'admin';
  }
}
