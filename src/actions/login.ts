"use server";

import * as zod from "zod";
import { loginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (LoginValues: zod.infer<typeof loginSchema>) => {
    const validatedField = loginSchema.safeParse(LoginValues);

    if (!validatedField.success) {
        return { error: "invalid field" };
    }

    const { email, password } = validatedField.data;

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