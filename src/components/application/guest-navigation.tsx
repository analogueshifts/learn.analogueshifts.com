"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import NavLink from "./navlink";

import OurApps from "./our-apps";
import ResponsiveNavBar from "./responsive-navbar";
import LoggedInProfileDropdown from "./profile-dropdown";

import NavLogo from "@/assets/images/nav-logo.svg";

const GuestNavigation = ({ user, handleLogout }: any) => {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  //Close the Nav bar whenever the pathname changes
  useEffect(() => {
    if (open) {
      setOpen((previous) => !previous);
    }
  }, [pathname]);

  return (
    <div
      className={`w-full  bg-white flex justify-center h-20 large:h-[104px]  z-30 duration-500 fixed top-0 left-0`}
    >
      {/* Logout Idiom */}

      <nav className="bg-white max-w-[1650px] absolute z-30 h-20 large:h-[104px] px-6 sm:px-20 large:px-[112px] flex items-center justify-between w-full  ">
        {/* Primary Navigation Menu */}

        {/* Logo */}

        <Link href="https://www.analogueshifts.com">
          <Image
            src={NavLogo}
            alt=""
            className="large:w-[221px] w-40 sm:w-48 h-max"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-7 large:gap-10 lg:flex">
          <NavLink href="/" active={pathname === "/"}>
            Home
          </NavLink>

          <OurApps />

          <NavLink
            href="/courses"
            active={pathname === "/courses" || pathname.startsWith("/courses")}
          >
            Find Courses
          </NavLink>

          <NavLink active={false} href="https://blog.analogueshifts.com">
            Blog
          </NavLink>

          <NavLink href="https://www.analogueshifts.com/about" active={false}>
            About
          </NavLink>
          <NavLink href="https://www.analogueshifts.com/contact" active={false}>
            Contact
          </NavLink>
        </div>

        {/* Settings Dropdown */}
        {user ? (
          <LoggedInProfileDropdown handleLogout={handleLogout} user={user} />
        ) : (
          <div className="hidden lg:flex lg:items-center gap-6">
            <NavLink
              active={false}
              href="https://auth.analogueshifts.app?app=learn"
            >
              Login
            </NavLink>
            <Link
              className="text-[13px] large:text-base font-medium h-11 large:h-14 px-10  large:px-12 duration-200 rounded-2xl bg-background-darkYellow text-white hover:bg-transparent hover:text-background-darkYellow hover:ring-1 ring-background-darkYellow flex items-center justify-center"
              href="https://auth.analogueshifts.app?app=learn"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Hamburger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-[18px] flex flex-col gap-1.5 bg-transparent border-none outline-none"
          >
            <div
              className={`w-full h-[1px] bg-primary-boulder700 duration-300 ${
                open
                  ? "rotate-[45deg] translate-y-[3.6px]"
                  : "rotate-0 translate-y-0"
              }`}
            ></div>
            <div
              className={`w-full h-[1px] bg-primary-boulder700 duration-300 ${
                open
                  ? "-rotate-[45deg] -translate-y-[3.6px]"
                  : "rotate-0 translate-y-0"
              }`}
            ></div>
          </button>
        </div>
      </nav>

      {/* Responsive Navigation Menu */}

      <ResponsiveNavBar
        user={user}
        open={open}
        handleBlogNavigation={() => setOpen(false)}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default GuestNavigation;
