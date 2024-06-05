import Link from "next/link";
import React from "react";
import {
  FaFacebookSquare,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import ApplicationLogo from "./application-logo";

const Footer = () => {
  return (
    <footer className=" w-[94%] max-w-full overflow-hidden mobile:max-w-desktop mx-auto py-24 px-4">
      <div className="w-full flex flex-col gap-10">
        <ApplicationLogo />

        <div className="grid gap-3 text-xl text-dimGray font-medium w-max max-w-full">
          <a href="tel:+2348066708343" target="blank">
            <b>Call:</b> +12524042733
          </a>
          <a href="mailto:hello@analogueshifts.com" className="" target="blank">
            <b>Mail:</b> hello@analogueshifts.com
          </a>
        </div>

        <div className="flex gap-6 text-3xl text-dimLight">
          <a
            href="https://www.facebook.com/profile.php?id=100078666855898"
            target="blank"
          >
            <FaFacebookSquare />
          </a>
          <a href="https://www.instagram.com/analogueshifts_/" target="blank">
            <FaInstagram />
          </a>
          <a href="https://twitter.com/AnalogueShifts" target="blank">
            <FaTwitter />
          </a>
          {/* <a href="mailto:hello@analogueshifts.com" target='blank' target="blank"><ImGithub /></a> */}
          <a
            href="https://www.linkedin.com/company/analogue-shifts/"
            target="blank"
          >
            <FaLinkedin />
          </a>
        </div>
        <p className="copy text-start col-span-4 text-base text-mediumDarkGray">
          &copy; {new Date().getFullYear()} | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
