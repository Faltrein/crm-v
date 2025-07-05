import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { predvolby, staty, v_zakaznici } from "@prisma/client";
import { ReactNode } from "react";
import { File } from "formidable";
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
  predvolby?: predvolby[];
  staty?: staty[] | null;
  p_hash?: string | null;
  activeKey?: string | null;
  onUpdate?: React.Dispatch<React.SetStateAction<v_zakaznici | null>>;
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

export type SubNavClassType = {
  className: string;
  
}

export type ChangePasswordRequestBody = {
  zak_id: string;
  actualPass: string;
  newPass: string;
};

export interface FormDataAdresaPic {
  fields: Record<string, string>;
  files: Record<string, File | File[]>;
}

export type ChangeKontakty = {
  z_id: string;
  z_phone: string;
  z_phone_2: string;
  z_mail: string;
  z_mail_2: string;
  z_prefix: string;
  z_prefix_2: string;
}

export type ZakazniciPageType = {
  predvolby?: predvolby[];
  staty?: staty[];
}

export type ZakazniciInsUpType = {
  v_created: boolean,
  jmeno: string,
  surename: string,
  userName: string,
  mail: string,
  secondMail: string,
  prefix: string,
  phone: string,
  secondPrefix: string,
  secondPhone: string,
  city: string,
  adress: string, 
  owner: string,
  web: string,
  obcanstviVal: string,
  psc: string,
  accType: string,
  password: string,
  pozice: string,
  patri_pod: string,
}

export type SaveEmailAccountParams = {
  email: string;
  zak_id: string;
  password?: string;
  provider: string;  // např. "google", "outlook"
  oauth: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
};
