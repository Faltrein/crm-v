import { SaveEmailAccountParams } from "@/app/app_types/global_types";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { domain } from "@/app/shortcuts/shortcuts";

const prisma = new PrismaClient();

export function detectProvider(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return { name: "unknown", oauth: false };

  if (["gmail.com", "googlemail.com", "gmail.cz"].includes(domain)) return { name: "google", oauth: true };
  if (["outlook.com", "hotmail.com", "live.com", "msn.com", "office365.com"].includes(domain)) return { name: "microsoft", oauth: true };
  if (["yahoo.com", "ymail.com", "rocketmail.com"].includes(domain)) return { name: "yahoo", oauth: true };
  if (["icloud.com", "me.com", "mac.com"].includes(domain)) return { name: "apple", oauth: true };
  if (["protonmail.com", "pm.me"].includes(domain)) return { name: "protonmail", oauth: true };
  if (["zoho.com"].includes(domain)) return { name: "zoho", oauth: true };
  if (["fastmail.com"].includes(domain)) return { name: "fastmail", oauth: true };

  if (["seznam.cz", "centrum.cz", "email.cz", "post.cz", "tiscali.cz", "volny.cz"].includes(domain)) {
    return { name: domain.replace(".cz", ""), oauth: false };
  }

  if (["gmx.com", "gmx.de"].includes(domain)) return { name: "gmx", oauth: false };
  if (domain === "mail.com") return { name: "mailcom", oauth: false };
  if (domain === "aol.com") return { name: "aol", oauth: false };

  return { name: "generic", oauth: false };
}

export function getOAuthRedirectUrl(provider: string, email: string) {
  const scopes: Record<string, string[]> = {
    google: ["https://mail.google.com/"], // tady můžeš přidat další
    microsoft: [], // např. Microsoft Graph scopes
    yahoo: [],
    apple: [],
    // ...
  };

  const selectedScopes = scopes[provider] || [];

  const params = new URLSearchParams({
    action: "start",
    provider,
    email,
    scope: selectedScopes.join(" "),
  });

  const url = `${domain}api/oauth?${params.toString()}`;
  console.log("url je ", url);
  return url;
}

export async function saveEmailAccount({
  email,
  password,
  provider,
  oauth,
  accessToken,
  refreshToken,
  expiresAt,
}: SaveEmailAccountParams) {
  let hashedPassword: string | null = null;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  return await prisma.v_added_emails.create({
    data: {
      email,
      password: hashedPassword,
      provider,
      oauth,
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
      expiresAt: expiresAt || null,
    },
  });
}

export default async function handleAddEmail(body: any) {
  const { email, password } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ success: false, message: "Neplatný e-mail" }, { status: 400 });
  }

  const provider = detectProvider(email);

  if (provider.oauth) {
    const redirectUrl = getOAuthRedirectUrl(provider.name, email);
    return NextResponse.json({
      success: true,
      oauth: true,
      redirectUrl,
    });
  }

  try {
    const result = await saveEmailAccount({
      email,
      password,
      provider: provider.name,
      oauth: provider.oauth,
    });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Nepodařilo se uložit účet" }, { status: 500 });
  }
}