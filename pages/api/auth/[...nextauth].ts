import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { Api } from '@/my-api';

export default NextAuth({
  session: {
    maxAge: 60 * 15,
    updateAge: 15 * 10
  },

  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'johndoe@test.com'
        },
        password: { label: 'Password', type: 'password' }
      },

      authorize: (credentials) => {
        return Api.authorizeUser(credentials).then(({ data }) => ({
          email: data.email,
          name: data.username,
          lastLogin: data.lastLogin,
          dateCreated: data.dateCreated,
          isAdmin: data.isAdmin,
          accessToken: data.token,
          id: data._id
        }));
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        (token.accessToken = user.accessToken), delete user['accessToken'], (token.user = user);
      }

      return token;
    },
    signIn: ({ user }) => {
      return Api.getUserBlockStatus({ email: user.email })
        .then(() => true)
        .catch(() => false);
    },
    session: ({ session, token }) => {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    }
  },
  jwt: {
    secret: process.env.SECRET
  },
  pages: {
    error: '/error'
  }
});
