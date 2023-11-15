import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import bcrypt, { compare } from "bcryptjs";
import { prismadb } from "@/lib/prismadb";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "production",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Email",
        },
        password: {
          label: "Jelszó",
          type: "password",
          placeholder: "Jelszó",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Az email és a jelszó megadása kötelező.");
        }
        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            store: true, // Ez hozzáadja a boltot a felhasználóhoz
          },
        });

        if (!user) {
          throw new Error("Nincs felhasználó ezzel az email címmel.");
        }

        const passwordMatch = await compare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) {
          throw new Error("Hibás jelszó.");
        }

        // Az itt visszaadott user objektum tartalmazza az 'id' mezőt
        return {
          id: `${user.id}`,
          username: user.username,
          email: user.email,
          store: user.store,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        return {
          ...token,
          username: user.username,
          // store: user.store,
          // Itt hozzáadhatod a boltot a tokenhez, ha a user objektum tartalmazza a boltot
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          store: token.store, // Itt hozzáadhatod a boltot a session-höz
        },
      };
    },
  },
};
