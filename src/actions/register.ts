"use server";

import * as zod from "zod";
import bcrypt from "bcryptjs";
import { User } from '@prisma/client';
import { registerSchema } from "@/schemas";
import { db } from "@/lib/database";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (LoginValues: zod.infer<typeof registerSchema>) => {
    const validatedField = registerSchema.safeParse(LoginValues);

    if (!validatedField.success) {
        return { error: "invalid field" };
    }

    const { email, password, name } = validatedField.data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const alreadyExistUser: User | null = await getUserByEmail(email);

    if (alreadyExistUser) {
        return { error: "email already in use" };
    }
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmation email sent!" };
};
