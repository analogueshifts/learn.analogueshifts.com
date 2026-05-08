"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Download, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const [isVerifying, setIsVerifying] = useState(true);
  const searchParams = useSearchParams();
  const ref = searchParams?.get("ref");

  useEffect(() => {
    // Simulate webhook/polling validation
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center animate-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Successful!</h1>
      
      {isVerifying ? (
        <div className="flex flex-col items-center gap-3 text-gray-500 my-8">
          <Loader2 className="w-6 h-6 animate-spin text-background-darkYellow" />
          <p className="font-medium">Confirming your enrollment...</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for enrolling! Your transaction <span className="font-mono text-xs bg-gray-100 px-2 py-1 border border-gray-200 rounded font-bold">#{ref || "TRX-12345"}</span> has been verified and your course access is now unlocked.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-14 px-8 text-lg font-bold bg-background-darkYellow hover:bg-yellow-600 text-white rounded-xl shadow-lg">
              <Link href="/courses/mobile-dev"><BookOpen className="w-5 h-5 mr-2" /> Access Course</Link>
            </Button>
            
            <Button variant="outline" className="h-14 px-8 text-lg font-bold border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
              <Download className="w-5 h-5 mr-2" /> Receipt
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
