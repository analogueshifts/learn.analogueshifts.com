import GuestLayout from "@/components/application/layouts/guest";
import { Suspense } from "react";
import FailedClient from "./FailedClient";
import { Loader2 } from "lucide-react";

export default function FailedPage() {
  return (
    <GuestLayout>
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center py-20 px-6 border-t border-gray-200">
        <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-gray-400" />}>
          <FailedClient />
        </Suspense>
      </div>
    </GuestLayout>
  );
}
