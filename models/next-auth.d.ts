/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  export interface Session {
    accessToken: string;
    user: User;
  }
  interface User {
    email: string;
    name: string;
    lastLogin: string;
    dateCreated: string;
    isAdmin: boolean;
    accessToken: string;
    id: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    idToken?: string;
    accessToken: string;
    user: User;
  }
}
