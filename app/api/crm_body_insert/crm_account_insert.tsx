import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import type { ChangePasswordRequestBody, FormDataAdresaPic } from "@/app/app_types/global_types";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

export async function changePasswordAccount(body: ChangePasswordRequestBody) {
  try {
    const { zak_id, actualPass, newPass } = body;

    if (!zak_id || !actualPass || !newPass) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const user = await prisma.v_login.findFirst({
      where: { z_id: parseInt(zak_id, 10) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(actualPass, user.password_hash);
    if (!valid) {
      return NextResponse.json({ valid: false, error: "Špatné původní heslo" }, { status: 401 });
    }

    const newHash = await bcrypt.hash(newPass, 10);

    await prisma.v_login.update({
      where: { id: user.id },
      data: { password_hash: newHash },
    });

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



function normalizeField(field: string | string[] | undefined): string {
  if (!field) return "";
  if (Array.isArray(field)) return field[0];
  return field;
}

export async function updateAdresaPicData(formData: FormDataAdresaPic) {
  try {
    const uploadDir = path.resolve("C:/tmp");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const {
      z_id,
      z_city,
      z_adress,
      z_psc,
      z_web,
      z_stat,
      z_obcanstvi,
      z_pic_old,
    } = formData.fields;

    const zId = normalizeField(z_id);
    const zCity = normalizeField(z_city);
    const zAdress = normalizeField(z_adress);
    const zPsc = normalizeField(z_psc);
    const zWeb = normalizeField(z_web);
    const zStat = normalizeField(z_stat);
    const zObcanstvi = normalizeField(z_obcanstvi);
    const zPicOld = normalizeField(z_pic_old);

    let finalPicName = zPicOld || "";

    if (formData.files.z_pic) {
      const file = Array.isArray(formData.files.z_pic)
        ? formData.files.z_pic[0]
        : formData.files.z_pic;

      if (!fs.existsSync(file.filepath)) {
        throw new Error(`Soubor neexistuje na cestě: ${file.filepath}`);
      }

      const fileExt = path.extname(file.originalFilename || "");
      const newFileName = `${Date.now()}_${file.newFilename}${fileExt}`;
      const targetDir = path.join(process.cwd(), "public", "crm_data", zWeb);

      fs.mkdirSync(targetDir, { recursive: true });

      const targetPath = path.join(targetDir, newFileName);

      fs.renameSync(file.filepath, targetPath);

      finalPicName = `/${zWeb}/${newFileName}`;
    }

    const user = await prisma.v_login.findFirst({
      where: { z_id: parseInt(zId, 10) },
    });

    if (!user) {
      throw new Error("Uživatel nenalezen");
    }

    await prisma.v_zakaznici.update({
      where: { id: user.id },
      data: {
        z_city: zCity,
        z_adress: zAdress,
        z_psc: zPsc,
        z_web: zWeb,
        z_state: zStat,
        z_obcanstvi: zObcanstvi,
        z_pic: finalPicName,
      },
    });

    return NextResponse.json({ success: true });
  } catch  {
    return NextResponse.json({ success: false, error: "Chyba při ukládání." });
  }
}