import { NextRequest, NextResponse } from "next/server";import { emailsData, kontrolaTokenu } from "./emails_functions/emails_functions";

export async function POST(req: NextRequest) {
    const { email, zak_id } = await req.json();
    const available_emails = await emailsData(zak_id, email);

    if (available_emails.length === 0) {
        return NextResponse.json({ success: false, message: "Email not found" });
    }

    const provider = available_emails.provider;

    switch (provider) {
    case 'google':
    case 'outlook':
    case 'yahoo':
        const data = await kontrolaTokenu(available_emails.id, available_emails.email, available_emails.refreshToken, available_emails.accessToken, available_emails.expiresAt, provider);
        console.log('data', data);
        return NextResponse.json({ success: true, provider, data });
    default:
        // ostatní providery, třeba s heslem apod.
        return NextResponse.json({ success: true, message: "Provider not handled" });
    }

  return NextResponse.json({ success: true});
}