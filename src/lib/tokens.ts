import { db } from "@/lib/database";
import { v4 as uuid } from "uuid";

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