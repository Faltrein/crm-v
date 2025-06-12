"use client";
import { CookieHandlerType, DropdownTypes } from "../app_types/global_types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ActiveLinkType, Col_6Type } from "./venca_lib_types";
import  Col  from "react-bootstrap/Col";
import { Dropdown } from "react-bootstrap";
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
    <Link href={href} className={`px-3 py-2 text-center link-text ${combinedClass}`}>
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

export const deleteCookie = (name: string): void => {
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0`;
};

export const PhonePrefixSelect = ({ value, onChange } : DropdownTypes) => {
  const prefixes = ["+420", "+421", "+49", "+44"];

  return (
    <Dropdown onSelect={onChange} className="phone-prefix-dropdown d-inline-bloc" >
      <Dropdown.Toggle
        variant="secondary"
        id="dropdown-phone-prefix"
        className="rounded-start"
      >
        {value}
      </Dropdown.Toggle>
      <Dropdown.Menu className="rounded w-100">
        {prefixes.map((prefix) => (
          <Dropdown.Item eventKey={prefix} key={prefix} active={prefix === value}>
            {prefix}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export const MaxDropdown = ({ value, onChange } : DropdownTypes) => {
  const countries = [
    { code: "", label: "Vyber stát" },
    { code: "cz", label: "Česká republika" },
    { code: "sk", label: "Slovensko" },
    { code: "de", label: "Německo" },
    { code: "pl", label: "Polsko" },
  ];

  
  return (
    <Dropdown
      onSelect={onChange}
      className="max-dropdown"
      style={{ width: "100%" }}
    >
      <Dropdown.Toggle
        variant="secondary"
        id="dropdown-country-select"
        className="w-100 rounded"
        style={{ textAlign: "left" }}
      >
        {countries.find((c) => c.code === value)?.label || "Vyber stát"}
      </Dropdown.Toggle>

      <Dropdown.Menu className="rounded w-100">
        {countries.map(({ code, label }) => (
          <Dropdown.Item
            eventKey={code}
            key={code}
            active={code === value}
          >
            {label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};