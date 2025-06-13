import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import type { ChangeKontakty, ChangePasswordRequestBody, FormDataAdresaPic } from "@/app/app_types/global_types";
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



export function normalizeField(field: string | string[] | undefined): string {
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

      // Oprava názvu souboru: žádné dvojité přípony jako .png.png
      const originalName = file.originalFilename || "soubor";
      const baseName = path.parse(originalName).name;
      const fileExt = path.extname(originalName);
      const newFileName = `${Date.now()}_${baseName}${fileExt}`;

      const targetDir = path.join(process.cwd(), "public", "crm_data", zWeb);
      fs.mkdirSync(targetDir, { recursive: true });

      const targetPath = path.join(targetDir, newFileName);
      fs.renameSync(file.filepath, targetPath);

      finalPicName = `/crm_data/${zWeb}/${newFileName}`;
    }

    const user = await prisma.v_login.findFirst({
      where: { z_id: parseInt(zId, 10) },
    });

    if (!user) {
      throw new Error("Uživatel nenalezen");
    }

    let stat_obcanstvi;
    if (zStat && zObcanstvi) {
      stat_obcanstvi = await prisma.staty.findFirst({
        where: {id: parseInt(zStat, 10)},
      });
    }
    await prisma.v_zakaznici.update({
      where: { id: user.id },
      data: {
        z_city: zCity,
        z_adress: zAdress,
        z_psc: zPsc,
        z_web: zWeb,
        z_state: stat_obcanstvi?.stat,
        z_obcanstvi: stat_obcanstvi?.obcanstvi,
        ...(finalPicName.length > 0 && { z_pic: finalPicName }),
      },
    });

    return NextResponse.json({ success: true, stat: stat_obcanstvi?.stat, obcanstvi : stat_obcanstvi?.obcanstvi });
  } catch (error) {
    console.error("Chyba při ukládání adresy:", error);
    return NextResponse.json({ success: false, error: "Chyba při ukládání." });
  }
}

export async function updateAccountKontakty (body:ChangeKontakty) {

  try {
    const z_id = normalizeField(body.z_id);
    const phone = normalizeField(body.z_phone);
    const phone_2 = normalizeField(body.z_phone_2);
    const mail = normalizeField(body.z_mail);
    const mail_2 = normalizeField(body.z_mail_2);
    const prefix = normalizeField(body.z_prefix);
    const prefix_2 = normalizeField(body.z_prefix_2);
    
    const user = await prisma.v_zakaznici.findFirst({
      where: {z_id : parseInt(z_id, 10)}
    });

    if (!user) {
      return NextResponse.json({success:false, error: "Uživatel nenalezen"});
    }

    await prisma.v_zakaznici.update({
      where: {id: user.id},
      data: {
        z_phone: phone,
        z_phone_2: phone_2,
        z_mail: mail,
        z_mail_2: mail_2,
        z_pred_1: prefix,
        z_pred_2: prefix_2,
      }
    });

    return NextResponse.json({success:true});
  } catch (error) {
    
    console.error("Chyba v updateAccountKontakty:", error);
    return NextResponse.json({success: false, error: "chyba na straně serveru"});
  }
}