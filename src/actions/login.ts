"use server";

import * as zod from "zod";
import { loginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import type { User } from "@prisma/client";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (LoginValues: zod.infer<typeof loginSchema>) => {
    const validatedField = loginSchema.safeParse(LoginValues);

    if (!validatedField.success) {
        return { error: "invalid field" };
    }

    const { email, password } = validatedField.data;
    const existingUser: User | null = await getUserByEmail(email);

    if (!existingUser || !existingUser.password || !existingUser.email) {
        return { error: "Email does not exist" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { error: "Please confirm the verification email!" };
    }
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
            case "CredentialsSignin":
                return { error: "invalid credentials" };
            default:
                return { error: "unknown error" };
            }
        }
        throw error;
    }
};
