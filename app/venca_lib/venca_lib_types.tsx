import { predvolby, staty } from "@prisma/client";

export type ActiveLinkType = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
};

export type Col_6Type = {
  className?: string;
  text_1: string;
  text_2: string | null | undefined ;
}

export type DropdownTypes = {
  value: string;
  onChange: (value: string | null) => void;
  predvolby?: predvolby[];
  staty?: staty[] | null;
  target?: "stat" | "obcanstvi";
}

export type Col_6FloatInputType = {
  className:string;
  firstValue: string;
  firstSetter: (firstValue: string) => void;
  firstId: string;
  firstLabel: string;
  firstType: string;
  secondValue: string;
  secondSetter: (secondValue: string) => void;
  secondId: string;
  secondLabel: string;
  secondClassName?: string;
  secondType: string;
}