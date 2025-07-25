import { ChangeEvent, CSSProperties, JSX, ReactNode } from "react";
import * as FaIcons from "react-icons/fa";
import { iconPacks } from "../helpers/iconPacks";

export type InputProps = {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number" | "password" | "email";
  maxLength?: number;
  className?: string;
  style?: CSSProperties;
  onKeyDown?: any;
  rightIcon?: () => JSX.Element;
};
export type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  style?: CSSProperties;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};
export type IPInfoProps = {
  country: string;
};

// React Icon Types -----------------------------------

export type IconFamily = keyof typeof iconPacks;
export type IconName<T extends IconFamily> = keyof (typeof iconPacks)[T];

export type ReactIconProps<T extends IconFamily> = {
  family: T;
  name: IconName<T>;
  size?: number;
  color?: string;
  className?: string;
};

// Social Link Types -----------------------------------

export type SocialLink = {
  id: number;
  url: string;
  target: string;
  iconFamily: "fa";
  iconName: keyof typeof FaIcons;
  size: number;
  color: string;
};
