import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "../login/login";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    //console.log("Request body v route.ts:", body); // tady uvidíš data v konzoli serveru

    const { action, user, pass } = body;

    switch (action) {
      case "login": {
        const result = await loginUser(user, pass);
        return NextResponse.json(result.data, { status: result.status });
      }
      default:
        return NextResponse.json({ error: "Neznámá akce" }, { status: 400 });
    }
  } catch  {
    //console.error("Chyba při parsování requestu nebo v route.ts:", err);
    return NextResponse.json({ error: "Interní chyba serveru" }, { status: 500 });
  }
}
