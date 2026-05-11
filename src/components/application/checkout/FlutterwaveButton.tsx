"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FlutterwaveButtonProps {
  email: string;
  name: string;
  amount: number;
  disabled?: boolean;
  onSuccess?: () => void;
}

export default function FlutterwaveButton({ email, name, amount, disabled, onSuccess }: FlutterwaveButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "FLWPUBK_TEST-placeholder",
    tx_ref: Date.now().toString(),
    amount,
    currency: "USD",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email,
      phone_number: "",
      name,
    },
    customizations: {
      title: "Analogue Shifts",
      description: "Payment for course enrollment",
      logo: "https://learn.analogueshifts.com/logo.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    setIsProcessing(true);
    handleFlutterPayment({
      callback: (response) => {
        setIsProcessing(true);
        if (response.status === "successful") {
          toast.success("Payment successful! Verifying...");
          if (onSuccess) onSuccess();
          setTimeout(() => {
            router.push(`/checkout/success?ref=${response.tx_ref}`);
          }, 1500);
        } else {
          router.push(`/checkout/failed?reason=payment_failed`);
        }
        closePaymentModal();
      },
      onClose: () => {
        setIsProcessing(false);
        toast.error("Payment cancelled.");
      },
    });
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={disabled || isProcessing}
      className="w-full h-14 text-lg font-bold bg-[#F5A623] hover:bg-[#F5A623]/90 text-white rounded-xl shadow-lg"
    >
      {isProcessing ? (
        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
      ) : (
        <><Lock className="w-5 h-5 mr-2" /> Pay with Flutterwave</>
      )}
    </Button>
  );
}
