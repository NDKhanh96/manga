import { db } from '@/lib/database';

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        return await db.twoFactorConfirmation.findUnique({
            where: {
                userId,
            },
        });
    } catch (error) {
        return null;
    }
};

export const createTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        return await db.twoFactorConfirmation.create({
            data: {
                userId,
            },
        });
    } catch (error) {
        return null;
    }
};

export const deleteTwoFactorConfirmationById = async (id: string) => {
    try {
        return await db.twoFactorConfirmation.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        return null;
    }
};
