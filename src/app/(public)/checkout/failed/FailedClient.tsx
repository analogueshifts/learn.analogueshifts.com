"use client";

import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function FailedClient() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason");

  return (
    <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center animate-in zoom-in duration-500">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Failed</h1>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        {reason === "payment_failed" 
          ? "We couldn't process your payment with the selected provider. Please try a different payment method." 
          : "We couldn't process your payment. This might be due to insufficient funds, a network error, or a declined card. No charges were made."}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="h-14 px-8 text-lg font-bold bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg">
          <Link href="/checkout"><RefreshCw className="w-5 h-5 mr-2" /> Try Again</Link>
        </Button>
        
        <Button asChild variant="outline" className="h-14 px-8 text-lg font-bold border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
          <Link href="/courses"><ArrowLeft className="w-5 h-5 mr-2" /> Browse Courses</Link>
        </Button>
      </div>
    </div>
  );
}
