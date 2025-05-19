import { Suspense } from "react";
import Validate from "./components/validate";
import GuestLayout from "@/components/application/layouts/guest";

export default function Page() {
  return (
    <Suspense fallback={<p></p>}>
      <GuestLayout>
        <Validate />
      </GuestLayout>
    </Suspense>
  );
}
