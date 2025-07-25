// components/react-icon.tsx
import React, { JSX } from "react";
import { iconPacks } from "../helpers/iconPacks";
import { IconFamily, ReactIconProps } from "../@types/types";

function ReactIcon<T extends IconFamily>({
  family,
  name,
  size = 24,
  color = "inherit",
  className = "",
}: ReactIconProps<T>): JSX.Element | null {
  const IconPack = iconPacks[family] as Record<
    string,
    React.ComponentType<any>
  >;
  const IconComponent = IconPack[name as string];

  if (!IconComponent) return null;

  return <IconComponent size={size} color={color} className={className} />;
}

export default ReactIcon;
