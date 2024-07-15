import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { IconContext } from "react-icons";

export default function SignUpForm() {
  return (
    <div className="py-20 bg-neutral-100 flex justify-center">
      <div>
        <header>Folllow us on our socials</header>

        <div className="flex text-[3.2rem] gap-2 mt-4">
          <FaFacebook />
          <FaInstagramSquare />
        </div>
      </div>
    </div>
  );
}
