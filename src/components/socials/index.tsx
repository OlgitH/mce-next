import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { IconContext } from "react-icons";

export default function SocialSection() {
  return (
    <div className="py-20 bg-neutral-100 flex justify-center">
      <div>
        <header>Folllow us on our socials</header>

        <div className="flex text-[3.2rem] gap-2 mt-4">
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
