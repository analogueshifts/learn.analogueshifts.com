"use client";

import Link from "next/link";
import ApplicationLogo from "./application-logo";
import { useState } from "react";

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`w-full max-w-desktop px-4 bg-white rounded-[18px] flex flex-col mobile:hidden overflow-hidden duration-300 ${
        open ? "h-72" : "h-16"
      }`}
    >
      <div className="w-full min-h-16 h-16 flex items-center justify-between">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-[18px] flex flex-col gap-1.5 bg-transparent border-none outline-none"
        >
          <div
            className={`w-full h-[1px] bg-dimGray duration-300 ${
              open
                ? "rotate-[45deg] translate-y-[3.6px]"
                : "rotate-0 translate-y-0"
            }`}
          ></div>
          <div
            className={`w-full h-[1px] bg-dimGray duration-300 ${
              open
                ? "-rotate-[45deg] -translate-y-[3.6px]"
                : "rotate-0 translate-y-0"
            }`}
          ></div>
        </button>
        <div className="pr-7">
          <ApplicationLogo />
        </div>
      </div>
      <div className="w-4/5 pt-3 mx-auto flex flex-col gap-3">
        <Link
          href="https://www.analogueshifts.com"
          className="w-full h-[40px] justify-center flex items-center duration-300 hover:bg-lightGray/30 text-dimGray text-base font-normal rounded-[6px]"
        >
          Recruitment Site
        </Link>
        <Link
          href="/contact"
          className="w-full h-[40px] justify-center flex items-center duration-300 hover:bg-lightGray/30 text-dimGray text-base font-normal rounded-[6px]"
        >
          Contact Us
        </Link>
        <Link
          href=""
          className="w-full bg-[rgb(51,51,51)] h-[40px] justify-center flex items-center duration-300 hover:bg-[rgb(51,51,51)]/90 text-white text-base font-normal rounded-[6px]"
        >
          Register Here
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavbar;
