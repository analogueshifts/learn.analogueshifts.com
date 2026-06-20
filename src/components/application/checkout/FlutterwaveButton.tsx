"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FlutterwaveButtonProps {
  courseIds: string[];
  couponCode: string | null;
  disabled?: boolean;
  onSuccess?: () => void;
}

export default function FlutterwaveButton({ courseIds, couponCode, disabled, onSuccess }: FlutterwaveButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [initiating, setInitiating] = useState(true);
  const [payment, setPayment] = useState<{ txRef: string; publicKey: string; amount: number; email: string; name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    setInitiating(true);
    fetch("/api/payment/flutterwave/initiate", {
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
    public_key: payment?.publicKey || "FLWPUBK_TEST-placeholder",
    tx_ref: payment?.txRef ?? "",
    amount: payment?.amount ?? 0,
    currency: "USD",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: payment?.email ?? "",
      phone_number: "",
      name: payment?.name ?? "",
    },
    customizations: {
      title: "Analogue Shifts",
      description: "Payment for course enrollment",
      logo: "https://learn.analogueshifts.com/logo.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    if (!payment) return;
    setIsProcessing(true);
    handleFlutterPayment({
      callback: async (response) => {
        setIsProcessing(true);
        closePaymentModal();

        if (response.status !== "successful") {
          router.push(`/checkout/failed?reason=payment_failed`);
          return;
        }

        const verifyResponse = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: response.tx_ref }),
        });

        if (!verifyResponse.ok) {
          toast.error("We couldn't verify your payment. Contact support if you were charged.");
          router.push(`/checkout/failed?reason=verification_failed`);
          return;
        }

        toast.success("Payment successful!");
        onSuccess?.();
        router.push(`/checkout/success?ref=${response.tx_ref}`);
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
      disabled={disabled || isProcessing || initiating || !payment}
      className="w-full h-14 text-lg font-bold bg-[#F5A623] hover:bg-[#F5A623]/90 text-white rounded-xl shadow-lg"
    >
      {isProcessing || initiating ? (
        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {initiating ? "Preparing..." : "Processing..."}</>
      ) : (
        <><Lock className="w-5 h-5 mr-2" /> Pay with Flutterwave</>
      )}
    </Button>
  );
}
