import Image from "next/image";
import Logo from "@/assets/images/nav-logo.svg";

const ApplicationLogo = () => (
  <Image src={Logo} alt="" className="w-40 h-max" />
);

export default ApplicationLogo;
