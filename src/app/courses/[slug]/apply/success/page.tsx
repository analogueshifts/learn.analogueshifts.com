import GuestLayout from "@/components/application/layouts/guest";
import React from "react";
import Landing from "./components/landing";

export default function Page() {
  return (
    <GuestLayout>
      <main className="h-max w-full large:px-[112px] tablet:px-6 px-20">
        <Landing />
      </main>
    </GuestLayout>
  );
}
