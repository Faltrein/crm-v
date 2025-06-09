import { UpdateData } from "@/app/app_types/global_types";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function loginUser(user: string, pass: string) {
  if (!user || !pass) {
    return { status: 400, data: { error: "Uživatelské jméno a heslo jsou povinné." } };
  }

  const normalizedUser = user.toLowerCase();
  try {
    const foundUser = await prisma.v_login.findFirst({
      where: {
        OR: [
          { email: normalizedUser },
          { username: normalizedUser },
        ],
      },
      select: {
        id: true,
        password_hash: true,
        locked: true,
        locked_until: true,
        f_attempts: true,
        v_created: true,
      },
    });

    if (!foundUser) {
      return { status: 401, data: { error: "Uživatel nenalezen." } };
    }

    const now = new Date();

    // Pokud je účet zamčený, a lock ještě trvá, vracíme chybu
    if (foundUser.locked && foundUser.locked_until && foundUser.locked_until > now) {
      return {
        status: 423, // Locked
        data: { 
          error: "Účet je zamčený",
          locked_until: foundUser.locked_until.toISOString() 
        }
      };
    } 

    // Pokud lock už vypršel, resetujeme zámek a pokusy
    if (foundUser.locked && foundUser.locked_until && foundUser.locked_until <= now) {
      await prisma.v_login.update({
        where: { id: foundUser.id },
        data: {
          locked: false,
          locked_until: null,
          f_attempts: 0,
        },
      });
      // Aktualizujeme i lokální proměnnou, aby login pokračoval normálně
      foundUser.locked = false;
      foundUser.locked_until = null;
      foundUser.f_attempts = 0;
    }

    // Porovnání hesla
    const passwordMatch = await bcrypt.compare(pass, foundUser.password_hash);
    if (!passwordMatch) {
      // Zvýšíme počet neúspěšných pokusů
      const attempts = (foundUser.f_attempts ?? 0) + 1;
      const updateData: UpdateData = { f_attempts: attempts };

      if (attempts >= 5) {
        updateData.locked = true;
        updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 minutový lock
      }

      await prisma.v_login.update({
        where: { id: foundUser.id },
        data: updateData,
      });

      return { status: 401, data: { error: "Nesprávné heslo." } };
    }

    // Úspěšné přihlášení => reset pokusů a zámku
    if (foundUser.f_attempts !== 0 || foundUser.locked) {
      await prisma.v_login.update({
        where: { id: foundUser.id },
        data: {
          f_attempts: 0,
          locked: false,
          locked_until: null,
        },
      });
    }

    if (foundUser.v_created === true) {
      // vytvořit token stejným způsobem jako při odeslání emailu
      const token = `${foundUser.id}-${Date.now()}`;
      return {
        status: 200,
        data: {
          token,   // token pro frontend
        }
      };
    } else {
      // běžné přihlášení - vrátit jen id
      return {
        status: 200,
        data: {
          id: foundUser.id,
        }
      };
    }
  } catch  {
    //console.error("Login error:", err);
    return { status: 500, data: { error: "Interní chyba serveru." } };
  }
}


export async function changePassword(userId: string, newPassword: string) {
  if (!userId || !newPassword) {
    return { status: 400, data: { error: "Chybí ID uživatele nebo heslo." } };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      return { status: 400, data: { error: "Neplatné ID uživatele." } };
    }
    await prisma.v_login.update({
      where: { id: userIdInt },
      data: {
        password_hash: hashedPassword,
        f_attempts: 0,
        locked: false,
        locked_until: null,
        v_created: false,
      },
    });

    return { status: 200, data: { message: "Heslo úspěšně změněno." } };
  } catch (err) {
    console.error("Chyba při změně hesla:", err);
    return { status: 500, data: { error: "Interní chyba serveru." } };
  }
}