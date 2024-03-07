"use server";

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { settingsSchema } from '@/schemas';
import { currentUser } from '@/lib/auth';
import { getUserByEmail, getUserById } from '@/data/user';
import { db } from '@/lib/database';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const settings = async (values: z.infer<typeof settingsSchema>) => {
    try {
        const user = await currentUser();

        if (!user || !user.id) {
            return { error: 'Unauthorized' };
        }
    
        const dbUser = await getUserById(user.id);

        if (!dbUser) {
            return { error: 'Unauthorized' };
        }

        // if OAuth user dbUser.password is null
        if (user.isOAuth) {
            values.newPassword = undefined;
            values.confirmNewPassword = undefined;
            values.isTwoFactorEnabled = undefined;
        }

        // if not OAuth, dbUser.password is not null
        if (dbUser.password) {
            const passwordMatch = await bcrypt.compare(
                values.password,
                dbUser.password,
            );

            if (!passwordMatch) {
                return { error: 'Current password is incorrect!' };
            }

            values.password = dbUser.password;
        }

        if (values.password && values.newPassword && values.confirmNewPassword && dbUser.password) {
            const hashedPassword = await bcrypt.hash(values.newPassword, 10);

            values.password = hashedPassword;
            values.newPassword = undefined;
            values.confirmNewPassword = undefined;
        }

        // if (values.email && values.email !== dbUser.email) {
        //     const existingUser = await getUserByEmail(values.email);

        //     if (existingUser && existingUser.id !== user.id) {
        //         return { error: 'Email already in use!' };
        //     }

        //     const verificationToken = await generateVerificationToken(values.email);

        //     await sendVerificationEmail(
        //         verificationToken.email,
        //         verificationToken.token
        //     );

        //     return { success: 'Please confirm the verification email!' };
        // }

        // send email confirm change password 7:25:00
        // update 7:30:00
        await db.user.update({
            where: {
                id: user.id
            },
            data: {
                ...values
            }
        });

        return { success: 'Settings updated!' };
    } catch (error) {
        return { error: 'Cannot update because something went wrong!' };
    }
};