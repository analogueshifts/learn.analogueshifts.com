"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, Suspense } from "react";

import GuestNavigation from "../guest-navigation";
import LogoutConfirmation from "../logout-confirmation";
import Footer from "../footer";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [idiomModalDisplay, setIdiomModalDisplay] = useState(false);

  return (
    <Suspense>
      <section className="w-full min-h-screen">
        <LogoutConfirmation
          close={() => setIdiomModalDisplay(false)}
          open={idiomModalDisplay}
          onConfirm={() => signOut({ callbackUrl: "/" })}
        />
        <GuestNavigation
          handleLogout={() => setIdiomModalDisplay(true)}
          user={session?.user ?? null}
        />

        <div className="w-full pt-16">{children}</div>
      </section>
      <Footer />
    </Suspense>
  );
}
