import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getStaty() {
    const staty = await prisma.staty.findMany({
        select: {
            id: true,
            stat: true,
            obcanstvi: true,
        },
    });
    return staty;
}

export async function getPredvolby() {
    const predvolby = await prisma.predvolby.findMany({
        select: {
            id: true,
            predvolba: true,
        }
    });
    return predvolby;
}
