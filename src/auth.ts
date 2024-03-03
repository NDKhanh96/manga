import 'next-auth';
import 'next-auth/jwt';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/database';
import authConfig from '@/auth.config';
import type { UserRole } from '@prisma/client';
import { getUserById } from '@/data/user';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getAccountByUserId } from '@/data/account';

declare module 'next-auth' {
    // eslint-disable-next-line no-unused-vars
    interface User {
        role: UserRole;
        isTwoFactorEnabled: boolean;
        isOAuth: boolean;
    }
}

declare module "next-auth/jwt" {
    // eslint-disable-next-line no-unused-vars
    interface JWT {
        role: UserRole;
        isTwoFactorEnabled: boolean;
        isOAuth: boolean;
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== 'credentials') {
                return true;
            }

            const existingUser = user.id ? await getUserById(user.id) : null;

            if (!existingUser?.emailVerified) {
                return false;
            }

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation =
                    await getTwoFactorConfirmationByUserId(existingUser.id);

                if (!twoFactorConfirmation) {
                    return false;
                }

                await db.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirmation.id,
                    },
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
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
                session.user.isOAuth = token.isOAuth;
            }

            return session;
        },
        // jwt() always run before session()
        async jwt({ token, trigger, user }) {
            if (!token.sub) {
                return token;
            }
            
            if (trigger === 'update') {
                const userToUpdate = await getUserById(token.sub);

                if (userToUpdate?.name) {
                    token.name = userToUpdate.name;
                }

                if (userToUpdate?.email) {
                    token.email = userToUpdate.email;
                }

                if (userToUpdate?.isTwoFactorEnabled) {
                    token.isTwoFactorEnabled = userToUpdate.isTwoFactorEnabled;
                }
            }

            // user only available at the moment when click signed in
            if (!user || !user.id) {
                return token;
            }

            const existingAccount = await getAccountByUserId(user.id);
            
            // account only available with OAuth login user
            token.isOAuth = !!existingAccount;
            token.role = user.role;
            token.isTwoFactorEnabled = user.isTwoFactorEnabled;
            
            return token;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig,
});
