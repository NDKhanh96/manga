import { db } from "@/lib/database";
import { User } from "@prisma/client";

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user: User | null = await db.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    } catch (error) {
        return null;
    }
};

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const user: User | null = await db.user.findUnique({
            where: {
                id,
            },
        });

        return user;
    } catch (error) {
        return null;
    }
};