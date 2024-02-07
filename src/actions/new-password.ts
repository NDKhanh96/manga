'use server';

import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { newPasswordSchema } from '@/schemas';
import * as zod from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/database';

export const newPassword = async (
    values: zod.infer<typeof newPasswordSchema>,
    token?: string | null,
) => {
    if (!token) {
        return { error: 'Missing token!' };
    }

    const validatedFields = newPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'invalid password!' };
    }

    const { password } = validatedFields.data;
    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: 'Token does not exist!' };
    }

    const hasExpired = new Date(existingToken?.expires) < new Date();

    if (hasExpired) {
        return { error: 'Token has expired!' };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: 'Email does not exist!' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            password: hashedPassword,
        },
    });

    await db.passwordResetToken.delete({
        where: {
            id: existingToken.id,
        },
    });

    return { success: 'Password changed!' };
};
