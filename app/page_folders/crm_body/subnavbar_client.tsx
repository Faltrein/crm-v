"use client"
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ZakazniciSubnavContent } from "@/app/zakaznici/zakaznici_client";



export const SubNawbar_client = () => {

    const pathname = usePathname();
  const [subnav, setSubnav] = useState<React.ReactNode>(null);

  useEffect(() => {
    console.log('current path', pathname);

    switch (pathname) {
      case '/zakaznici':
        setSubnav(<ZakazniciSubnavContent />);
        break;
      default:
        setSubnav(null);
    }
  }, [pathname]);
    return (
        <>
        <span> a</span>
        <span>{subnav}</span>
        </>
    );
}