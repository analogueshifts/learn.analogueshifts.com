"use client";
import { useState, useEffect, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import ChevronDown from "@/assets/images/chevron-down.svg";

interface Params {
  user: any;
  handleLogout: () => void;
}

export default function LoggedInProfileDropdown({
  user,
  handleLogout,
}: Params) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef: any = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  const RenderMenu = ({ item }: { item: any }) => (
    <button
      onClick={() => item.action()}
      className="w-max flex gap-4 items-center duration-300 hover:translate-x-1"
    >
      <Image width={40} height={40} src={item.image} alt="" />
      <div className="flex flex-col items-start gap-1.5">
        <h3 className="text-black font-semibold text-base">{item.title}</h3>
        <p className="text-primary-boulder400 font-normal text-[9.8px]">
          {item.description}
        </p>
      </div>
    </button>
  );

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={toggleDropdown}
        className="profile-menu hidden lg:flex gap-2 bg-gray-50 items-center cursor-pointer p-1 rounded-full"
      >
        <Avatar className="w-7 h-7">
          <AvatarImage
            className="object-cover"
            src={
              user?.user?.user_profile?.avatar
                ? user.user.user_profile.avatar
                : null
            }
            alt="Profile"
          />
          <AvatarFallback className="bg-[#ffbb0a] text-white text-sm font-bold ">
            {user?.user?.email?.slice(0, 1)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="profile-chevron duration-300">
          <Image width={14} height={14} src={ChevronDown} alt="" />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="our-apps-menu flex flex-col gap-6 large:gap-8 w-max absolute top-10 rounded-[18px] -right-10 bg-white py-9 large:py-10 large:px-14 px-12"
          >
            <RenderMenu
              item={{
                title: "Log Out",
                description: "End your session securely",
                image: "/profile/logout.svg",
                action: handleLogout,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
