import GuestLayout from "@/components/application/layouts/guest";
import Landing from "./components/landing";
import { Suspense } from "react";

export default async function Page() {
  return (
    <GuestLayout>
      <section className="w-full flex flex-col items-center large:pt-[76px]">
        <Suspense>
          <Landing />
        </Suspense>
      </section>
    </GuestLayout>
  );
}
