import GuestLayout from "@/components/application/layouts/guest";
import { Suspense } from "react";
import SuccessClient from "./SuccessClient";
import { Loader2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <GuestLayout>
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center py-20 px-6 border-t border-gray-200">
        <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-background-darkYellow" />}>
          <SuccessClient />
        </Suspense>
      </div>
    </GuestLayout>
  );
}
