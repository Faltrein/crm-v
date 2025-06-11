import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./css/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { cookies } from "next/headers";
import { Crm_body } from "./page_folders/crm_body/Crm_body";
import SubNavbar from "./page_folders/crm_body/subnavbar";
import ClientReduxProvider from "./client_redux_provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "crm-v",
  description: "Vytvořeno webdevoloperem Venca-dev",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let podminka: number;
  const cookieStore = await cookies();
  const zak_id = cookieStore.get("zak_id");

  if (zak_id && zak_id.value) {
    podminka = 0;
  } else {
    podminka = 1;
  }

  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <>
              {podminka === 1 ? children : 
                <ClientReduxProvider>
                  <div className="container-fluid row g-0 mx-auto">
                    <div className="col-12 col-xl-3 col-xxl-2">
                      <div className="sticky-nav-body">
                        <SubNavbar />
                        <Crm_body zak_id={zak_id} />
                      </div>
                    </div>
                    <div className="col-12 col-xl-9 col-xxl-10">
                      {children}
                    </div>
                  </div>
                </ClientReduxProvider>
              }
            </>
        
      </body>
    </html>
  );
}
