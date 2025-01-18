import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import { AppSession } from '@/types';

interface User extends NextAuthUser {
  role: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: {
            label: 'Email',
            type: 'email',
          },
          password: {
            label: 'Password',
            type: 'password',
          },
        },
        async authorize(credentials): Promise<User | null> {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }
  
          const user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });
    
            if (!user) return null;
    
            const isPasswordValid = bcrypt.compareSync(credentials.password, user.hashedPassword!);
    
            if (isPasswordValid) {
              return { id: user.id.toString(), email: user.email, role: user.role, name: user.name };
            }
    
            return null;
        },
      }),
    ],
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: 'jwt' as const  // Use JWT for session management,
    },
    callbacks: {
      async jwt({ token, user }) {
          // Persist the user object to the JWT token after successful login
          if (user) {
            token.id = user.id;
            token.email = user.email;
            token.role = (user as User).role;
          }
          return token;
        },
      async session({ session, token }) {
        const user = (session as AppSession).user;
       if (token) {
          user.id = +(token.id as number);
          user.role = token.role as string;
        }
        return {...session, user };
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
      // signUp: "/auth/signup", // Specify custom sign-up page
    },
  };