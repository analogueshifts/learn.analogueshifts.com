"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PaystackButtonProps {
  courseIds: string[];
  couponCode: string | null;
  disabled?: boolean;
  onSuccess?: () => void;
}

export default function PaystackButton({ courseIds, couponCode, disabled, onSuccess }: PaystackButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [initiating, setInitiating] = useState(true);
  const [payment, setPayment] = useState<{ reference: string; publicKey: string; amount: number; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    setInitiating(true);
    fetch("/api/payment/paystack/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseIds, couponCode: couponCode ?? undefined }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setPayment(body.data);
      })
      .finally(() => setInitiating(false));
  }, [courseIds, couponCode]);

  const config = {
    reference: payment?.reference ?? "",
    email: payment?.email ?? "",
    amount: payment?.amount ?? 0,
    publicKey: payment?.publicKey || "pk_test_placeholder",
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = async (reference: any) => {
    setIsProcessing(true);
    toast.success("Payment successful! Verifying...");

    const response = await fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: reference.reference }),
    });

    if (!response.ok) {
      toast.error("We couldn't verify your payment. Contact support if you were charged.");
      router.push(`/checkout/failed?reason=verification_failed`);
      setIsProcessing(false);
      return;
    }

    onSuccess?.();
    router.push(`/checkout/success?ref=${reference.reference}`);
  };

  const onClose = () => {
    setIsProcessing(false);
    toast.error("Payment cancelled.");
  };

  const handlePayment = () => {
    if (!payment) return;
    setIsProcessing(true);
    initializePayment({ onSuccess: handleSuccess, onClose });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isProcessing || initiating || !payment}
      className="w-full h-14 text-lg font-bold bg-[#0BA4DB] hover:bg-[#0BA4DB]/90 text-white rounded-xl shadow-lg"
    >
      {isProcessing || initiating ? (
        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {initiating ? "Preparing..." : "Processing..."}</>
      ) : (
        <><Lock className="w-5 h-5 mr-2" /> Pay with Paystack</>
      )}
    </Button>
  );
}
