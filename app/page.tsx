import { Login } from "./page_folders/uvod/login";
import { cookies } from 'next/headers';
export async function generateMetadata() {
  const podminka = 1;

  return {
    title: podminka === 1 ? "Login – Crm-v" : "Crm-v Úvod",
  };
}

export default async function Home() {
  const podminka = 1;
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookiesConsent = cookieStore.get("cookieConsent");
  let consentValue = cookiesConsent?.value;

  if(!consentValue) {
    consentValue = "2";
  }
  console.log('cookie consent', consentValue);
  return (
    <>
      {podminka === 1 ? <Login consentValue={consentValue}/> : <div className="text-primary">Něco jiného</div>}
    </>
  );
}