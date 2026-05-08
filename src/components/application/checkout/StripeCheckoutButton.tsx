"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface StripeCheckoutButtonProps {
  amount: number;
  disabled?: boolean;
}

export default function StripeCheckoutButton({ amount, disabled }: StripeCheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsProcessing(true);
    toast.loading("Redirecting to Stripe...", { duration: 1500 });
    
    // Simulate API call to create Stripe session
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful checkout redirection
    router.push(`/checkout/success?ref=stripe_${Date.now()}`);
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={disabled || isProcessing}
      className="w-full h-14 text-lg font-bold bg-[#635BFF] hover:bg-[#635BFF]/90 text-white rounded-xl shadow-lg"
    >
      {isProcessing ? (
        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Redirecting...</>
      ) : (
        <><Lock className="w-5 h-5 mr-2" /> Pay with Credit Card</>
      )}
    </Button>
  );
}
