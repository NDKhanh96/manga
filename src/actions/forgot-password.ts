"use server";

import { forgotPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import type { User } from "@prisma/client";
import * as zod from "zod";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const forgotPassword = async (values: zod.infer<typeof forgotPasswordSchema>) => {
    const validatedFields = forgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "invalid email" };
    }

    const { email } = validatedFields.data;
    const existingUser: User | null = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email does not exist" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return { success: "Please confirm the verification email!" };
};