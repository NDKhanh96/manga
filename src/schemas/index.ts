import * as zod from "zod";

export const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(1, { message: "Password is required" }),
});

export const registerSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6, { message: "Minimum 6 characters required" }),
    name: zod.string().min(1, { message: "Name is required" }),
});

export const forgotPasswordSchema = zod.object({
    email: zod.string().email(),
});

export const newPasswordSchema = zod.object({
    password: zod.string().min(6, { message: "Minimum 6 characters required" }),
});