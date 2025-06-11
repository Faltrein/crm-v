"use client"
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ZakazniciSubnavContent } from "@/app/zakaznici/zakaznici_client";
import { Button, Row, Col } from "react-bootstrap";
import { useAppDispatch } from "@/app/redux-store/hooks";
import { deleteCookie } from "@/app/venca_lib/venca_lib";
import { setSubnavOpen } from "@/app/redux-store/accountSlice";

export const SubNawbar_client = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [subnav, setSubnav] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
    deleteCookie("zak_id");
    window.location.reload();
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
          {!isOpen && (
             <i className="bi bi-arrow-right-short ms-1 fs-3"></i>
          )}
           
          <span className="open-sub-text">
            {isOpen ? "Zavřít subnav" : "Otevřít subnav"}
          </span>
           {!isOpen && (
            <i className="bi bi-arrow-right-short fs-3 ms-1 arrow-in-btn"></i>
            )}
          {isOpen && (
            <i className="bi bi-arrow-left-short fs-3"></i>
          )}
        </Button>
      </div>

      {/* Vytáhnutý subnav mimo layout */}
      {(
        <div className={`subnav-container ${isOpen ? "active" : ""}`}>
          <Row>
            <Col xs="3">Logo</Col>
            <Col xs="6" className="d-flex align-items-center justify-content-center">{subnav}</Col>
            <Col xs="3" className="d-flex align-items-center justify-content-center" >
              <button className="v-btn-circle me-2" onClick={() => router.back()}>
                <i className="bi bi-arrow-left-short fs-3"></i>
              </button>
              <button className="v-btn-circle" onClick={() => router.forward()}>
                <i className="bi bi-arrow-right-short fs-3"></i>
              </button>
            </Col>
          </Row>
          
        </div>
      )}
    </>
  );
}