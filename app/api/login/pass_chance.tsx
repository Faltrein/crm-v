import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import {  NextResponse } from "next/server";
import { domain } from "@/app/shortcuts/shortcuts";

const prisma = new PrismaClient();

export async function sendResetEmail(user: string) {
  const userRecord = await prisma.v_login.findFirst({
    where: {
      OR: [
        { email: user },
        { username: user },
      ],
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!userRecord) {
    return NextResponse.json({ error: "Uživatel nenalezen" }, { status: 404 });
  }

  const resetToken = `${userRecord.id}-${Date.now()}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.centrum.cz",
    port: 587,
    secure: false, // STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    });

  const resetLink = `${domain}pass-change?token=${resetToken}`;

  await transporter.sendMail({
    from: `"v-CRM podpora" <${process.env.SMTP_USER}>`,
    to: userRecord.email,
    subject: "Obnova hesla - v-CRM",
    html: `
      <p>Dobrý den,</p>
      <p>Odkaz pro obnovu hesla:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Pokud jste o obnovu hesla nežádal(a), tento e-mail ignorujte.</p>
    `,
  });

  return NextResponse.json({ success: true });
}