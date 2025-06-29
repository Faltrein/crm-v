import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, getTokens, Provider } from "./oauth_handlers/oauth_handlers";
import { saveEmailAccount } from "../email_client/email_handlers/add_email";

export async function GET(req: NextRequest) {
  console.log('jsme zde přesměrování proběhlo ');
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const provider = searchParams.get("provider");
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  if (!provider || typeof provider !== "string") {
    return NextResponse.json({ success: false, message: "Provider není zadán" }, { status: 400 });
  }

  console.log("OAuth callback hit for", email, provider);

  switch (action) {
    case "start": {
      if (!email || typeof email !== "string") {
        return NextResponse.json({ success: false, message: "E-mail není zadán" }, { status: 400 });
      }

      try {
        const url = getAuthUrl(email, provider as Provider);
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

      // Pokud e-mail není v URL, zkus ho získat ze state (Base64 dekódování)
      if ((!finalEmail || typeof finalEmail !== "string") && state) {
        try {
            console.log("state raw:", state);
            const base64State = decodeURIComponent(state);
            console.log("state after decodeURIComponent:", base64State);
            const decoded = Buffer.from(base64State, "base64").toString();
            console.log("state decoded:", decoded);
            const parsed = JSON.parse(decoded);
            console.log("state parsed:", parsed);
            finalEmail = parsed.email;
            console.log('final email', finalEmail, email);
            email_send = finalEmail;
        } catch (e) {
            console.error("Chyba při dekódování state:", e);
        }
        }

      if (!email_send || typeof email_send !== "string") {
        return NextResponse.json({ success: false, message: "E-mail není zadán" }, { status: 400 });
      }

      try {
        console.log('EMAIL SEND alklasdjfhlasjdf', email_send);
        const tokens = await getTokens(provider as Provider, code);
        console.log("OAuth callback hit for", finalEmail, provider, email_send);
        console.log("Tokens received:", tokens);

        await saveEmailAccount({
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
