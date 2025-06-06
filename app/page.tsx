import { Login } from "./page_folders/uvod/login";

export async function generateMetadata() {
  const podminka = 1;

  return {
    title: podminka === 1 ? "Login – Crm-v" : "Crm-v Úvod",
  };
}

export default function Home() {
  const podminka = 1;

  return (
    <>
      {podminka === 1 ? <Login /> : <div>Něco jiného</div>}
    </>
  );
}