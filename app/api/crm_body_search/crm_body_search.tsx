import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export async function loggedZak (zak_id:string) {
    const data = await Prisma.v_zakaznici.findFirst({
        where: {
            z_id: parseInt(zak_id),
        },
    });
    return data;
}