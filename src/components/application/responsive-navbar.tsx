"use client";
import { useState } from "react";
import ResponsiveNavLink from "./responsive-navlink";

import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";
import ChevronDown from "@/assets/images/chevron-down.svg";

import ourApps from "./utilities/our-apps.json";
import Link from "next/link";

interface Params {
  user: any;
  open: boolean;
  handleLogout: () => void;
  handleBlogNavigation?: () => void;
}

export default function ResponsiveNavBar({
  handleBlogNavigation,
  user,
  open,
  handleLogout,
}: Params) {
  const [showApps, setShowApps] = useState(false);

  const MenuLink = ({ item }: { item: any }) => (
    <div>
      <Link href={item.href} className="w-full flex items-center gap-2">
        <Image src={item.image} alt="" width={25} height={25} />
        <div className="flex flex-col">
          <p className="text-[13px] text-primary-boulder900 font-semibold">
            {item.title}
          </p>
        </div>
      </Link>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          exit={{ x: "-100%" }}
          animate={{ x: 0 }}
          initial={{ x: "-100%" }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="bg-white z-40 overflow-y-auto  h-screen absolute overflow-hidden top-0 w-2/3 left-0 block lg:hidden"
        >
          <div className="pt-7 pb-5 px-8 w-full flex-col flex gap-8">
            <ResponsiveNavLink
              onClick={handleBlogNavigation}
              href="https://blog.analogueshifts.com"
            >
              Blog
            </ResponsiveNavLink>
            <ResponsiveNavLink href="/">Home</ResponsiveNavLink>
            <ResponsiveNavLink href="https://www.analogueshifts.com/about">
              About
            </ResponsiveNavLink>
            <ResponsiveNavLink href="/courses">Find Courses</ResponsiveNavLink>
            <ResponsiveNavLink href="https://www.analogueshifts.com/contact">
              Contact
            </ResponsiveNavLink>
            <div
              onClick={() => setShowApps((prev) => !prev)}
              className="cursor-pointer w-full flex items-center justify-between"
            >
              <p className="text-xl text-primary-boulder700 font-bold  focus:outline-none ">
                Products
              </p>
              <Image
                src={ChevronDown}
                alt=""
                className={` duration-300 w-4 h-max ${
                  showApps ? "rotate-180" : "-rotate-90"
                }`}
              />
            </div>

            {showApps && (
              <motion.div className="w-full flex flex-col gap-4 -translate-y-2 px-3">
                {ourApps.ready.map((item) => {
                  return <MenuLink key={item.title} item={item} />;
                })}

                {ourApps.comingSoon.map((item) => {
                  return <MenuLink key={item.title} item={item} />;
                })}
              </motion.div>
            )}

            {/* Responsive Settings Options */}
            {user ? (
              <>
                <ResponsiveNavLink onClick={handleLogout} href="">
                  Logout
                </ResponsiveNavLink>
              </>
            ) : (
              <>
                <ResponsiveNavLink href="https://auth.analogueshifts.app?app=learn">
                  Login
                </ResponsiveNavLink>
                <ResponsiveNavLink href="https://auth.analogueshifts.app?app=learn">
                  Sign Up
                </ResponsiveNavLink>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
