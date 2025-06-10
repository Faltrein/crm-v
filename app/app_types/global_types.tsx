import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { v_zakaznici } from "@prisma/client";
import { ReactNode } from "react";

export type CookiesLoginType = {
    consentValue: string;
}

export type LoginModalType = {
    open: boolean;
    setHideCookieBar: (value: boolean) => void;
    setCookieVal: (value: string) => void;
}

export type CookieHandlerType = {
    accept: boolean;
    setHideCookieBar: (value: boolean) => void;
    setCookieVal: (value: string) => void;
}

export type UpdateData = {
  f_attempts: number;
  locked?: boolean;
  locked_until?: Date | null;
};

export type ZakanikId = {
    zak_id: RequestCookie | undefined;
}

export type CrmBodyClientTypes = {
  crm_data: v_zakaznici | null;
};

export type CrmLinksType = {
  z_type: string;
}

export type AccountLeaveType = {
  acc_type: string;
}

export type SubNavbarType = {
  subnav?: ReactNode;
};