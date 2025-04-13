import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { IconContext } from "react-icons";
import React from "react";

type SocialsProps = {
  size?: "small" | "large";
};

export default function Socials({ size = "large" }: SocialsProps) {
  const isLarge = size === "large";

  const iconSize = isLarge ? "text-[2.5rem] md:text-[3.2rem]" : "text-[1.5rem]";
  const spacing = isLarge ? "gap-4" : "gap-2";

  return (
    <div className="flex">
      <div>
        <div className={`flex ${iconSize} ${spacing}`}>
          <a
            href="https://www.facebook.com/magicoffeexpedition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/magicoffeexpedition/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagramSquare />
          </a>
        </div>
      </div>
    </div>
  );
}
