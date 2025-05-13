"use client";
import { useUser } from "@/contexts/user";
import { useAuth } from "@/hooks/auth";
import { useState, useEffect, Suspense } from "react";

import Cookies from "js-cookie";
import GuestNavigation from "../guest-navigation";
import LogoutConfirmation from "../logout-confirmation";
import Footer from "../footer";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const { getUser } = useAuth();
  const [idiomModalDisplay, setIdiomModalDisplay] = useState(false);

  useEffect(() => {
    const token = Cookies.get("analogueshifts");
    if (token) {
      getUser({ setLoading: (loading) => {}, layout: "guest", token });
    }
  }, []);

  return (
    <Suspense>
      <section className="w-full min-h-screen">
        <LogoutConfirmation
          close={() => setIdiomModalDisplay(false)}
          open={idiomModalDisplay}
        />
        <GuestNavigation
          handleLogout={() => setIdiomModalDisplay(true)}
          user={user}
        />

        <div className="w-full pt-16">{children}</div>
      </section>
      <Footer />
    </Suspense>
  );
}
