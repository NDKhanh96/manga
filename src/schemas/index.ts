import * as zod from 'zod';

export const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(1, { message: 'Password is required' }),
    code: zod.optional(zod.string()),
});

export const registerSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6, { message: 'Minimum 6 characters required' }),
    name: zod.string().min(1, { message: 'Name is required' }),
});

export const forgotPasswordSchema = zod.object({
    email: zod.string().email(),
});

export const newPasswordSchema = zod.object({
    password: zod.string().min(6, { message: 'Minimum 6 characters required' }),
});

export const settingsSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required' }),
    email: zod.string().email(),
    newPassword: zod.string().optional(),
    confirmNewPassword: zod.string().optional(),
    isTwoFactorEnabled: zod.boolean().optional(),
    password: zod.string().min(1, { message: 'Current password is required' }),
}).refine((data) => {
    if (data.confirmNewPassword && !data.newPassword) {
        return false;
    }

    return true;
}, {
    message: "New password is required!",
    path: ["newPassword"]
})
    .refine((data) => {
        if (data.newPassword && !data.confirmNewPassword) {
            return false;
        }

        return true;
    }, {
        message: "Confirm new password is required!",
        path: ["confirmNewPassword"]
    });
