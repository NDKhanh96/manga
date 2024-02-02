import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/schemas";
import { User } from "@prisma/client";
import { getUserByEmail } from "@/data/user";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const user: User | null = await getUserByEmail(email);

                    if (!user || !user.password) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (passwordMatch) {
                        return user;
                    }
                }

                return null;
            }
        })
    ],
} satisfies NextAuthConfig;