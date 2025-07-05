import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const {email } = await req.json();

  const emails = await prisma.v_added_emails.findMany({
    where: {
      email,
    },
  });

  return NextResponse.json({ success: true, emails });
}