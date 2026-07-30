"use client";

import { useSession, signOut } from "next-auth/react";
import { ShieldAlert } from "lucide-react";

export default function AccountStatusBanner() {
  const { data: session } = useSession();
  const status = session?.user?.status;

  if (!status || status === "ACTIVE") return null;

  const isBanned = status === "BANNED";

  return (
    <div className="sticky top-0 z-40 w-full bg-red-600 text-white px-4 py-3 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-center">
      <ShieldAlert className="w-4 h-4 shrink-0" />
      <span>
        {isBanned
          ? "Your account has been banned."
          : "Your account has been suspended."}{" "}
        You no longer have access to this dashboard. Contact support if you believe this is a mistake.
      </span>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login?error=banned" })}
        className="underline font-bold hover:text-red-100 transition-colors"
      >
        Log out
      </button>
    </div>
  );
}
