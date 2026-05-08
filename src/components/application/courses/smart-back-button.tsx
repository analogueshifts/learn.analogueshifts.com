"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  fallbackHref?: string;
  fallbackText?: string;
  className?: string;
  forceFallback?: boolean;
}

export default function SmartBackButton({ 
  fallbackHref = "/courses", 
  fallbackText = "Back to Courses",
  className = "inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-tan transition-colors mb-4",
  forceFallback = false
}: Props) {
  const [savedAnchor, setSavedAnchor] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read the secret memory flag left by the homepage links
    const anchor = sessionStorage.getItem("scrollBackAnchor");
    if (anchor) {
      setSavedAnchor(anchor);
    }
  }, []);

  // Prevent hydration flicker
  if (!mounted) return null;

  // If there is no secret flag, or we are forcing the fallback, we render the fallback or nothing
  if (!savedAnchor || forceFallback) {
    if (fallbackHref === "none") return null;
    return (
      <Link href={fallbackHref} className={className}>
        <ArrowLeft className="w-4 h-4" />
        {fallbackText}
      </Link>
    );
  }

  return (
    <Link 
      href="/" 
      onClick={() => {
        // Leave a secret instruction for the homepage to scroll down
        sessionStorage.setItem("scrollTarget", savedAnchor);
        // Clear memory so it doesn't get stuck forever
        sessionStorage.removeItem("scrollBackAnchor");
      }}
      className={className}
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Home
    </Link>
  );
}
