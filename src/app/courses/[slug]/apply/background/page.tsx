import GuestLayout from "@/components/application/layouts/guest";
import Landing from "./components/landing";

export default async function Page() {
  return (
    <GuestLayout>
      <section className="w-full flex flex-col items-center large:pt-[76px]">
        <Landing />
      </section>
    </GuestLayout>
  );
}
