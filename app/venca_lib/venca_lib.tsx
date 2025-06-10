"use client";
import { CookieHandlerType } from "../app_types/global_types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ActiveLinkType } from "./venca_lib_types";

export const Temp_cleaner = () => {
    return (
        <button type="button" className="btn-danger btn" onClick={() => {

            localStorage.clear();
            document.cookie.split(";").forEach(cookie => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
            });

            alert("Cache a cookies byly smazány.");
        }}>
            clearni cache
        </button>
    );
}

export const handleCookie = ({accept, setHideCookieBar, setCookieVal} : CookieHandlerType) => {
    const userId = crypto.randomUUID();

    document.cookie = `cookieConsent=${accept ? "1" : "0"}; path=/; max-age=${60 * 60 * 24 * 365}`;
    document.cookie = `cookieUserId=${userId}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const consent = getCookie("cookieConsent");

    if(consent) {
        setCookieVal(consent);
    }
    setHideCookieBar(true);
};

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const lastPart = parts.pop(); 
    if (lastPart !== undefined) {
      return lastPart.split(';').shift() || null;
    }
  }
  return null;
};

export const addToCookie = (name: string, value: string, maxAgeSeconds: number): void => {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`;
};

export const ActiveLink = ({href, children, className = "", activeClassName = "active-link",
}: ActiveLinkType) => { 
  const pathname = usePathname();
  const isActive = pathname === href;
  const combinedClass = `${className} ${isActive ? activeClassName : ""}`.trim();

  return (
    <Link href={href} className={`px-3 py-2 text-center text-dark ${combinedClass}`}>
      {children}
    </Link>
  );
};