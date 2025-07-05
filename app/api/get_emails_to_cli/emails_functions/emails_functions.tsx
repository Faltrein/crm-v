import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Message {
  id: string;
  threadId: string;
}
export async function emailsData (zak_id: string, email:string) {
    const zak_id_pass = Number(zak_id);
    const emails = await prisma.v_added_emails.findFirst({
        where: {
        email,
        zak_id: zak_id_pass
        },
    });

    return emails;
}

function isTokenExpired(expiresAt: string): boolean {
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  return now >= new Date(expiryDate.getTime() - 60 * 1000);
}
export async function kontrolaTokenu(id:number ,email: string, refreshToken: string, accessToken: string, expiresAt: string, provider:string) {
  const expired = isTokenExpired(expiresAt);
  console.log('expiration', expired);
    if (!expired) {
        try {
        const { newAccessToken, newExpiresAt } = await refreshAccessToken(refreshToken, provider);
        console.log('new acces token', newAccessToken);
        console.log('expires at', newExpiresAt);
        await updateTokenDb(id, newAccessToken, newExpiresAt);
         return await callOauthFunction(provider, newAccessToken);
        } catch (error) {
        console.error("Error refreshing token for", email, error);
        throw error; // nebo vrátit nějaký error response, záleží jak to chceš řešit
        }
  } else {
    // Token je platný, nemusíme nic dělat
     return await callOauthFunction(provider, accessToken);
  }
}

async function refreshAccessToken(refreshToken: string, provider:string) {
  const { url, client_id, client_secret } = await getUrl(provider);

  const params = new URLSearchParams();
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);
  params.append("refresh_token", refreshToken);
  params.append("grant_type", "refresh_token");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();

  const newAccessToken = data.access_token;
  const expiresInSec = data.expires_in;
  const newExpiresAt = new Date(Date.now() + expiresInSec * 1000).toISOString();

  return { newAccessToken, newExpiresAt };
}

async function updateTokenDb(id: number, newAccessToken: string, newExpiresAt: string) {
  await prisma.v_added_emails.update({
    where: { id },
    data: {
      accessToken: newAccessToken,
      expiresAt: newExpiresAt,
      updatedAt: new Date(),
    },
  });
}

async function getUrl (provider: string) {
    let url:string = "";
    let client_id:string = "";
    let client_secret:string = ""; 

    switch(provider) {
        case 'google':
            url = "https://oauth2.googleapis.com/token";
            client_id = process.env.GOOGLE_CLIENT_ID!;
            client_secret = process.env.GOOGLE_CLIENT_SECRET!;
            break;
    }

     return { url, client_id, client_secret };
}

async function callOauthFunction (provider: string, accessToken:string) {
    switch(provider) {
        case 'google':
            return await getAllGmailMessages(accessToken);
            break;
    }
}

//gmail

type GmailMessageDetail = {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  payload?: {
    headers?: Array<{
      name: string;
      value: string;
    }>;
    body?: {
      size: number;
      data?: string;
    };
    parts?: any[]; // pokud chceš detailněji, můžeš dál typovat
  };
};

async function getAllGmailMessages(
  accessToken: string,
  totalMaxResults = 1000
): Promise<GmailMessageDetail[]> {
  const allMessages: GmailMessageDetail[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const params = new URLSearchParams();
    params.append("maxResults", "500");
    params.append("includeSpamTrash", "true"); // 🔑 Tohle je klíčové!
    if (nextPageToken) {
      params.append("pageToken", nextPageToken);
    }

    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gmail API response error body:", errorBody);
      throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
    }

    const data: {
      messages?: { id: string }[];
      nextPageToken?: string;
    } = await response.json();

    if (data.messages) {
      allMessages.push(...data.messages.map((msg) => ({ id: msg.id } as GmailMessageDetail)));
    }

    nextPageToken = data.nextPageToken;

    if (allMessages.length >= totalMaxResults) {
      break;
    }
  } while (nextPageToken);

  const limitedMessages = allMessages.slice(0, totalMaxResults);

  const batchSize = 10;
  const detailedMessages: GmailMessageDetail[] = [];

  for (let i = 0; i < limitedMessages.length; i += batchSize) {
    const batch = limitedMessages.slice(i, i + batchSize);

    const batchDetails = await Promise.all(
      batch.map(async (msg) => {
        const detailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!detailResponse.ok) {
          const errorBody = await detailResponse.text();
          console.error("Gmail message detail error:", errorBody);
          throw new Error(
            `Gmail API error (detail): ${detailResponse.status} ${detailResponse.statusText}`
          );
        }

        const messageDetail: GmailMessageDetail = await detailResponse.json();
        return messageDetail;
      })
    );

    detailedMessages.push(...batchDetails);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return detailedMessages;
}