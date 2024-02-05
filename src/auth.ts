import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/database";
import authConfig from "@/auth.config";
import type { UserRole } from "@prisma/client";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface User {
    role: UserRole
  }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        }
    },
    callbacks: {
        async signIn ({ user, account }) {
            if (account?.provider !== 'credentials') {
                return true;
            }

            const existingUser = user.id ? await getUserById(user.id) : null;

            if (!existingUser?.emailVerified) {
                return false;
            }

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if (!twoFactorConfirmation) {
                    return false;
                }

                await db.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirmation.id
                    }
                });
            }

            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (!token.sub) {
                return token;
            }
            
            // user only available at the moment when click signed in
            if (user) {
                token.role = user.role;
            }

            return token;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
});