export type Provider = "google" | "outlook" | "seznam";

export function getAuthUrl(email: string, provider: Provider) {
  const redirectUri = `http://localhost:3000/api/oauth?action=callback&provider=${provider}`;

  switch (provider) {
    case "google": {
      const clientId = process.env.GOOGLE_CLIENT_ID!;
      const scope = encodeURIComponent(
         "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://mail.google.com/"
      );

      // Zakódujeme e-mail do state pro bezpečný přenos
      const state = encodeURIComponent(Buffer.from(JSON.stringify({ email })).toString("base64"));

      const url =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${scope}` +
        `&access_type=offline` +
        `&prompt=consent` +
        `&login_hint=${encodeURIComponent(email)}` +
        `&state=${state}`;

      console.log('Google OAuth URL:', url);
      return url;
    }

    case "outlook": {
      const clientId = process.env.OUTLOOK_CLIENT_ID!;
      const scope = encodeURIComponent("openid offline_access https://outlook.office.com/mail.read");

      const state = encodeURIComponent(Buffer.from(JSON.stringify({ email })).toString("base64"));

      return (
        `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` +
        `?client_id=${clientId}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_mode=query` +
        `&scope=${scope}` +
        `&state=${state}` +
        `&login_hint=${encodeURIComponent(email)}`
      );
    }

    case "seznam":
      throw new Error("Seznam OAuth není podporován");

    default:
      throw new Error("Nepodporovaný provider");
  }
}

export async function getTokens(provider: Provider, code: string) {
  const redirectUri = `http://localhost:3000/api/oauth?action=callback&provider=${provider}`;
  console.log('url pro tokeny', redirectUri);

  switch (provider) {
    case "google": {
      const clientId = process.env.GOOGLE_CLIENT_ID!;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
      if (!clientId || !clientSecret) {
        throw new Error("Google client ID/secret nejsou nastaveny.");
      }

      
      const bodyParams = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });

      console.log("Odesíláme request na Google token endpoint:", bodyParams.toString());

      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: bodyParams,
      });

      if (!response.ok) {
        console.log('redirect uri', redirectUri);
        console.log('body paramentry', bodyParams);
        console.log('g-response', response);
        const errorText = await response.text();
        console.error(`Google token error ${response.status}:`, errorText);
        throw new Error(`Failed to get tokens from Google: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Google token response:", data);

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      };
    }

    case "outlook": {
      const clientId = process.env.OUTLOOK_CLIENT_ID!;
      const clientSecret = process.env.OUTLOOK_CLIENT_SECRET!;
      if (!clientId || !clientSecret) {
        throw new Error("Outlook client ID/secret nejsou nastaveny.");
      }

      const bodyParams = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });

      console.log("Odesíláme request na Outlook token endpoint:", bodyParams.toString());

      const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: bodyParams,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Outlook token error ${response.status}:`, errorText);
        throw new Error(`Failed to get tokens from Outlook: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Outlook token response:", data);

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      };
    }

    case "seznam":
      throw new Error("Seznam OAuth není podporován");

    default:
      throw new Error("Nepodporovaný provider");
  }
}
