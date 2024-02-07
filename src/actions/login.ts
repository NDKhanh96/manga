'use server';

import * as zod from 'zod';
import { loginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import {
    generateTwoFactorToken,
    generateVerificationToken,
} from '@/lib/tokens';
import { getUserByEmail } from '@/data/user';
import type { User } from '@prisma/client';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import {
    deleteTwoFactorTokenById,
    getTwoFactorTokenByEmail,
} from '@/data/two-factor-token';
import {
    deleteTwoFactorConfirmationById,
    createTwoFactorConfirmationByUserId,
    getTwoFactorConfirmationByUserId,
} from '@/data/two-factor-confirmation';

export const login = async (LoginValues: zod.infer<typeof loginSchema>) => {
    const validatedField = loginSchema.safeParse(LoginValues);

    if (!validatedField.success) {
        return { error: 'invalid field' };
    }

    const { email, password, code } = validatedField.data;
    const existingUser: User | null = await getUserByEmail(email);

    if (!existingUser || !existingUser.password || !existingUser.email) {
        return { error: 'Email does not exist' };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { error: 'Please confirm the verification email!' };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email,
            );

            if (!twoFactorToken || twoFactorToken.token !== code) {
                return { error: 'Invalid code' };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: 'Code has expired' };
            }

            await deleteTwoFactorTokenById(twoFactorToken.id);

            const existingConfirmation = await getTwoFactorConfirmationByUserId(
                existingUser.id,
            );

            if (existingConfirmation) {
                await deleteTwoFactorConfirmationById(existingConfirmation.id);
            }

            await createTwoFactorConfirmationByUserId(existingUser.id);
        } else {
            const twoFactorToken = await generateTwoFactorToken(
                existingUser.email,
            );

            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
            );

            return { twoFactor: true };
        }
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials' };
                default:
                    return { error: 'Unknown Signin error' };
            }
        }
        throw error;
    }
};
