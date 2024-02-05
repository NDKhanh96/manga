import { db } from "@/lib/database";

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        return await db.twoFactorToken.findUnique({
            where: {
                token,
            },
        });
    } catch (error) {
        return null;
    }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        return await db.twoFactorToken.findFirst({
            where: {
                email,
            },
        });
    } catch (error) {
        return null;
    }
};

export const deleteTwoFactorTokenById = async (id: string) => {
    try {
        return await db.twoFactorToken.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        return null;
    }
};