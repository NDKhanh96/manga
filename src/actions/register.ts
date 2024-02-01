"use server";

import * as zod from "zod";
import { registerSchema } from "@/schemas";

export const register = async (LoginValues: zod.infer<typeof registerSchema>) => {
    const validatedField = registerSchema.safeParse(LoginValues);

    if (!validatedField.success) {
        return { error: "invalid field" };
    }

    return { success: "email sent" };
};