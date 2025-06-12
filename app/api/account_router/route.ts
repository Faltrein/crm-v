import { NextRequest, NextResponse } from "next/server";
import { changePasswordAccount } from "../crm_body_insert/crm_account_insert";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { action } = body;

    switch (action) {
      case "changePasswordAccount":
        return await changePasswordAccount(body); // jen body nově v app routeru
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}