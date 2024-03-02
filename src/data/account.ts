import { db } from '@/lib/database';

export const getAccountByUserId = async (userId: string) => {
    try {
        return await db.account.findFirst({
            where: {
                userId,
            },
        });
    } catch (error) {
        return null;
    }
};