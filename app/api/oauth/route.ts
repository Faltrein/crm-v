import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, getTokens, Provider } from "./oauth_handlers/oauth_handlers";
import { saveEmailAccount } from "../email_client/email_handlers/add_email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const provider = searchParams.get("provider");
  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const zak_id = searchParams.get("zak_id");
  console.log('zákaznické id je' , zak_id);
  if (!provider || typeof provider !== "string") {
    return NextResponse.json({ success: false, message: "Provider není zadán" }, { status: 400 });
  }

  switch (action) {
    case "start": {
      if (!email || typeof email !== "string") {
        return NextResponse.json({ success: false, message: "E-mail není zadán" }, { status: 400 });
      }

      if (!zak_id || typeof zak_id !== "string") {
        return NextResponse.json({ success: false, message: "Zak_id není zadán" }, { status: 400 });
      }
      try {
        const url = getAuthUrl(email, provider as Provider, zak_id);
        return NextResponse.redirect(url);
      } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
      }
    }

    case "callback": {
      if (!code || typeof code !== "string") {
        return NextResponse.json({ success: false, message: "Chybí kód" }, { status: 400 });
      }

      let finalEmail = email;
      const state = searchParams.get("state");

      let email_send;
      let zak_id_pass;
      // Pokud e-mail není v URL, zkus ho získat ze state (Base64 dekódování)
      if ((!finalEmail || typeof finalEmail !== "string") && state) {
        try {
            const base64State = decodeURIComponent(state);
            const decoded = Buffer.from(base64State, "base64").toString();
            const parsed = JSON.parse(decoded);
            finalEmail = parsed.email;
            email_send = finalEmail;
            zak_id_pass = parsed.zak_id;
        } catch (e) {
            console.error("Chyba při dekódování state:", e);
        }
        }

      if (!email_send || typeof email_send !== "string") {
        return NextResponse.json({ success: false, message: "E-mail není zadán" }, { status: 400 });
      }

      try {
        const tokens = await getTokens(provider as Provider, code);

        await saveEmailAccount({
          zak_id: zak_id_pass,
          email: email_send,
          provider,
          oauth: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
        });

        return new Response(
          `<!DOCTYPE html>
          <html>
            <head>
              <script>
                window.close();
              </script>
            </head>
          </html>`,
          { headers: { "Content-Type": "text/html" } }
        );
      } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, message: "Chyba při zpracování OAuth callbacku" }, { status: 500 });
      }
    }

    default:
      return NextResponse.json({ success: false, message: "Neznámá akce" }, { status: 400 });
  }
}
