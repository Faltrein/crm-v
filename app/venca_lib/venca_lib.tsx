"use client";
import { CookieHandlerType } from "../app_types/global_types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {createContext, useState, useContext} from "react";
import { ActiveLinkType, Col_6Type } from "./venca_lib_types";
import  Col  from "react-bootstrap/Col";

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

export const Col_6 = ({className, text_1, text_2} : Col_6Type) => {
  return (
    <>
      <Col xs="6" className={className}>
        {text_1}
      </Col>
      <Col xs="6" className={className}>
        {text_2}
      </Col>
    </>
  );
}


/*todo*/
type AccordionContextType = {
  activeKey: string | null;
  toggle: () => void;
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export const AccordionProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const toggle = () => {
    setActiveKey((prev) => (prev === "0" ? null : "0")); // Toggle první accordion item
  };

  return (
    <AccordionContext.Provider value={{ activeKey, toggle }}>
      {children}
    </AccordionContext.Provider>
  );
};

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("useAccordion must be used within AccordionProvider");
  return context;
};