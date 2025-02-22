'use client'
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";
interface IClientFooter {
  image: any,
  index: number
}
const ClientFooter = ({ image, index }:IClientFooter) => {
  const {theme} = useTheme();

  return (
    <Image
      src={image}
      key={index}
      style={{ objectFit: "contain" }}
      width={24}
      height={24}
      alt="social"
      className={theme === "light" ? "filter invert" : undefined}
    />
  );
};

export default ClientFooter;
