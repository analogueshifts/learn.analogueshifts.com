"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function CountdownTimer({ hours = 48 }: { hours?: number }) {
  const [timeLeft, setTimeLeft] = useState(hours * 60 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 text-red-500 font-medium text-sm mt-4 bg-red-50 p-3 rounded-lg border border-red-100">
      <Clock className="w-4 h-4 animate-pulse" />
      <span className="font-bold">Limited time offer!</span> Ends in 
      <span className="tabular-nums font-bold">
        {h.toString().padStart(2, "0")}:{m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
