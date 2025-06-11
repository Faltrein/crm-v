"use client"
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ZakazniciSubnavContent } from "@/app/zakaznici/zakaznici_client";
import { Button } from "react-bootstrap";
import { setSubnavOpen } from "@/app/redux-store/accordionSlice";
import { useAppDispatch } from "@/app/redux-store/hooks";



export const SubNawbar_client = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [subnav, setSubnav] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    switch (pathname) {
      case "/zakaznici":
        setSubnav(<ZakazniciSubnavContent />);
        break;
      default:
        setSubnav(null);
    }
  }, [pathname]);

  const logout = () => {
    // logout logika
  };

  const toggleSubnav = () => {
    const newValue = !isOpen;
    setIsOpen(newValue);
    dispatch(setSubnavOpen(newValue));
  };
  return (
    <>
      {/* Horní panel */}
      <div className="vh-10 nav-border d-flex align-items-center justify-content-between px-3">
        <Button className="logout-btn" onClick={() => logout()}>
          Odhlásit
        </Button>
        <Button className="open-sub-btn" onClick={toggleSubnav}>
          <span className="open-sub-text">
            {isOpen ? "Zavřít subnav" : "Otevřít subnav"}
          </span>
          <i className="bi bi-arrow-left-short ms-1 fs-3"></i>
        </Button>
      </div>

      {/* Vytáhnutý subnav mimo layout */}
      {(
        <div className={`subnav-container ${isOpen ? "active" : ""}`}>
          {subnav}
        </div>
      )}
    </>
  );
}