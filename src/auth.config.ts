import type { NextAuthConfig } from 'next-auth';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/schemas';
import { User } from '@prisma/client';
import { getUserByEmail } from '@/data/user';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export default {
    providers: [
        // http://localhost:3000/api/auth/providers
        // this link contain call back url for github and google
        Github({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const user: User | null = await getUserByEmail(email);

                    if (!user || !user.password) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password,
                    );

                    if (passwordMatch) {
                        return user;
                    }
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;
