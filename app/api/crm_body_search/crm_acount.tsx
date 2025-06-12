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

export async function getHash(zak_id: number): Promise<string | null> {
  const p_hash = await prisma.v_login.findFirst({
    select: {
      password_hash: true,
    },
    where: {
      z_id: zak_id,
    },
  });

  return p_hash?.password_hash ?? null;
}