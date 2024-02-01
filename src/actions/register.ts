"use server";

import * as zod from "zod";
import bcrypt from "bcrypt";
import { User } from '@prisma/client';
import { registerSchema } from "@/schemas";
import { db } from "@/lib/database";
import { getUserByEmail } from "@/data/user";

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

    return { success: "register is success" };
};
// 2 06 42