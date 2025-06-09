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