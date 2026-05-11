"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PaystackButtonProps {
  email: string;
  amount: number; // in minor units (e.g. kobo or cents)
  disabled?: boolean;
  onSuccess?: () => void;
}

export default function PaystackButton({ email, amount, disabled, onSuccess }: PaystackButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const config = {
    reference: (new Date()).getTime().toString(),
    email,
    amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = (reference: any) => {
    setIsProcessing(true);
    toast.success("Payment successful! Verifying...");
    
    if (onSuccess) {
      onSuccess();
    }
    
    // Simulate webhook verification
    setTimeout(() => {
      router.push(`/checkout/success?ref=${reference.reference}`);
    }, 1500);
  };

  const onClose = () => {
    setIsProcessing(false);
    toast.error("Payment cancelled.");
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // @ts-ignore
    initializePayment(handleSuccess, onClose);
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={disabled || isProcessing}
      className="w-full h-14 text-lg font-bold bg-[#0BA4DB] hover:bg-[#0BA4DB]/90 text-white rounded-xl shadow-lg"
    >
      {isProcessing ? (
        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
      ) : (
        <><Lock className="w-5 h-5 mr-2" /> Pay with Paystack</>
      )}
    </Button>
  );
}
