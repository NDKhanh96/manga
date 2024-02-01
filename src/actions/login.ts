"use server";

import * as zod from "zod";
import { loginSchema } from "@/schemas";

export const login = async (LoginValues: zod.infer<typeof loginSchema>) => {
    const validatedField = loginSchema.safeParse(LoginValues);

    if (!validatedField.success) {
        return { error: "invalid field" };
    }

    return { success: "email sent" };
};