
import { Login } from "./page_folders/uvod_login/login";
import { cookies } from 'next/headers';
export async function generateMetadata() {
   let podminka:number;
    const cookieStore = await cookies();
    const zak_id = cookieStore.get("zak_id");
    
    if (zak_id && zak_id.value) {
      podminka = 0;
    } else {
      podminka = 1;
    }

  return {
    title: podminka === 1 ? "Login – Crm-v" : "Crm-v Úvod",
  };
}

export default async function Home() {
  let podminka:number;
  const cookieStore = await cookies();
  const zak_id = cookieStore.get("zak_id");

  if (zak_id && zak_id.value) {
    podminka = 0;
  } else {
    podminka = 1;
  }
  console.log('podminka je ' + podminka);
  const cookiesConsent = cookieStore.get("cookieConsent");
  let consentValue = cookiesConsent?.value;

  if(!consentValue) {
    consentValue = "2";
  }
  console.log('cookie consent', consentValue);
  return (
    <>
      {podminka === 1 ? <Login consentValue={consentValue}/> : 
      ""}
    </>
  );
}