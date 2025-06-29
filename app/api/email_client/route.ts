import { NextResponse } from "next/server";
import handleAddEmail from "./email_handlers/add_email";

export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  if (action === "add-email") {
    return handleAddEmail(body); // již používá správně NextResponse
  }

  return NextResponse.json({ success: false, message: "Neznámá akce." }, { status: 400 });
}