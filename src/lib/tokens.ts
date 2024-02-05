import { db } from "@/lib/database";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

export const generateVerificationToken = async (email: string) => {
    const token = uuid();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    
    await db.verificationToken.deleteMany({
        where: {
            email
        }
    });

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
    const token = uuid();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    
    await db.passwordResetToken.deleteMany({
        where: {
            email
        }
    });

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return passwordResetToken;
};

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 999_999).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    
    await db.twoFactorToken.deleteMany({
        where: {
            email
        }
    });

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return twoFactorToken;
};