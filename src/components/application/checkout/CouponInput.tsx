"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Tag, Check, X } from "lucide-react";

interface CouponInputProps {
  onValidated: (discountPercentage: number, code: string | null) => void;
  disabled?: boolean;
}

export default function CouponInput({ onValidated, disabled }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const validateCoupon = async () => {
    if (!code.trim()) {
      onValidated(0, null);
      setStatus("idle");
      setMessage("");
      return;
    }

    setIsValidating(true);
    
    // Simulate API call to /api/coupons/validate
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check localStorage for custom coupons
    const storedCoupons = JSON.parse(localStorage.getItem("platformCoupons") || "[]");
    const defaultCoupons = [
      { code: "BLACKFRIDAY", discount: "50%", status: "Active" },
      { code: "WELCOME20", discount: "20%", status: "Active" },
      { code: "SAVE20", discount: "20%", status: "Active" },
      { code: "SUMMER10", discount: "10%", status: "Expired" }
    ];
    
    const allCoupons = storedCoupons.length > 0 ? storedCoupons : defaultCoupons;
    
    const matchedCoupon = allCoupons.find((c: any) => c.code === code.toUpperCase());
    
    if (matchedCoupon) {
      const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons") || "[]");
      if (usedCoupons.includes(matchedCoupon.code)) {
        setStatus("error");
        setMessage("You have already used this coupon");
        onValidated(0, null);
      } else if (matchedCoupon.status === "Expired") {
        setStatus("error");
        setMessage("This coupon has expired");
        onValidated(0, null);
      } else if (matchedCoupon.maxUses !== "Unlimited" && matchedCoupon.currentUses >= matchedCoupon.maxUses) {
        setStatus("error");
        setMessage("This coupon has reached its usage limit");
        onValidated(0, null);
      } else {
        setStatus("success");
        setMessage(`${matchedCoupon.discount} discount applied!`);
        const discountValue = parseInt(matchedCoupon.discount.replace('%', ''));
        onValidated(discountValue, code.toUpperCase());
      }
    } else {
      setStatus("error");
      setMessage("Invalid coupon code");
      onValidated(0, null);
    }
    
    setIsValidating(false);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
        <Tag className="w-4 h-4 text-gray-400" /> Have a promo code?
      </h3>
      <div className="flex gap-3">
        <Input 
          placeholder="Enter code (e.g. SAVE20)" 
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setStatus("idle");
            setMessage("");
            if (!e.target.value) {
              onValidated(0, null);
            }
          }}
          disabled={disabled || isValidating}
          className="uppercase bg-white h-12 rounded-xl border-gray-200"
        />
        <Button 
          type="button"
          onClick={validateCoupon}
          disabled={!code.trim() || disabled || isValidating}
          variant="outline"
          className="shrink-0 h-12 px-6 rounded-xl border-gray-200 font-bold hover:bg-gray-50 text-gray-700"
        >
          {isValidating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Apply"}
        </Button>
      </div>
      
      {status === "success" && (
        <p className="text-sm text-green-600 font-bold flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
          <Check className="w-4 h-4" strokeWidth={3} /> {message}
        </p>
      )}
      
      {status === "error" && (
        <p className="text-sm text-red-500 font-bold flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
          <X className="w-4 h-4" strokeWidth={3} /> {message}
        </p>
      )}
    </div>
  );
}
