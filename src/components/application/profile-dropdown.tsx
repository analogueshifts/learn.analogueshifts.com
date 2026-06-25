"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { LayoutDashboard, User, LogOut } from "lucide-react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  const RenderMenu = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const content = (
      <>
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary-tan group-hover:bg-primary-tan group-hover:text-white transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-black font-semibold text-base group-hover:text-primary-tan transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-primary-boulder400 font-normal text-[10px]">
            {item.description}
          </p>
        </div>
      </>
    );

    if (item.href) {
      return (
        <Link
          href={item.href}
          onClick={() => setIsOpen(false)}
          className="w-max flex gap-4 items-center duration-300 hover:translate-x-1 group"
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={() => {
          setIsOpen(false);
          item.action();
        }}
        className="w-max flex gap-4 items-center duration-300 hover:translate-x-1 group text-left"
      >
        {content}
      </button>
    );
  };

  const role = user?.role?.toUpperCase() || "STUDENT";
  const dashboardUrl =
    role === "ADMIN"
      ? "/admin"
      : role === "TRAINER"
      ? "/trainer/dashboard"
      : "/student/dashboard";

  const dashboardTitle =
    role === "ADMIN"
      ? "Admin Panel"
      : role === "TRAINER"
      ? "Trainer Dashboard"
      : "Student Dashboard";

  const dashboardDesc =
    role === "ADMIN"
      ? "Manage courses, users & settings"
      : role === "TRAINER"
      ? "Manage your courses & earnings"
      : "Access your courses & progress";

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={toggleDropdown}
        className="profile-menu hidden lg:flex gap-2 bg-gray-50 items-center cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        <Avatar className="w-7 h-7">
          <AvatarImage
            className="object-cover"
            src={user?.image ?? undefined}
            alt="Profile"
          />
          <AvatarFallback className="bg-[#ffbb0a] text-white text-sm font-bold">
            {(user?.name ?? user?.email)?.slice(0, 1)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="profile-chevron duration-300">
          <Image width={14} height={14} src={ChevronDown} alt="" />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            exit={{ opacity: 0, y: 10 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="our-apps-menu flex flex-col gap-5 w-[280px] absolute top-12 rounded-[18px] -right-4 bg-white py-6 px-8 shadow-xl border border-gray-100 z-50"
          >
            <div className="pb-3 border-b border-gray-100 flex flex-col gap-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
              <p className="text-sm font-bold text-primary-tan truncate">{user?.name || user?.email}</p>
              <span className="inline-flex items-center w-max px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-background-darkYellow/10 text-background-darkYellow mt-1">
                {role}
              </span>
            </div>

            <div className="flex flex-col gap-5 pt-1">
              <RenderMenu
                item={{
                  title: dashboardTitle,
                  description: dashboardDesc,
                  icon: LayoutDashboard,
                  href: dashboardUrl,
                }}
              />
              <RenderMenu
                item={{
                  title: "My Profile",
                  description: "Manage your personal profile",
                  icon: User,
                  href: role === "ADMIN" ? "/admin/profile" : role === "TRAINER" ? "/trainer/profile" : "/student/profile",
                }}
              />
              <div className="border-t border-gray-100 pt-4 mt-1">
                <RenderMenu
                  item={{
                    title: "Log Out",
                    description: "End your session securely",
                    icon: LogOut,
                    action: handleLogout,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
