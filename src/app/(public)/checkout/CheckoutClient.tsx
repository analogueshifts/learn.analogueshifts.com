"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Trash2, Lock } from "lucide-react";
import GatewaySelector, { PaymentGateway } from "@/components/application/checkout/GatewaySelector";
import CouponInput from "@/components/application/checkout/CouponInput";
import { useCartStore } from "@/store/useCartStore";
import dynamic from "next/dynamic";

const PaystackButton = dynamic(() => import("@/components/application/checkout/PaystackButton"), { ssr: false });
const FlutterwaveButton = dynamic(() => import("@/components/application/checkout/FlutterwaveButton"), { ssr: false });
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutClient() {
  const [gateway, setGateway] = useState<PaymentGateway>("paystack");
  const [discount, setDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePaymentSuccess = () => {
    if (appliedCouponCode) {
      const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons") || "[]");
      if (!usedCoupons.includes(appliedCouponCode)) {
        usedCoupons.push(appliedCouponCode);
        localStorage.setItem("usedCoupons", JSON.stringify(usedCoupons));
      }
      
      const platformCoupons = JSON.parse(localStorage.getItem("platformCoupons") || "[]");
      if (platformCoupons.length > 0) {
        const updatedPlatformCoupons = platformCoupons.map((c: any) => {
          if (c.code === appliedCouponCode) {
            return { ...c, currentUses: (c.currentUses || 0) + 1 };
          }
          return c;
        });
        localStorage.setItem("platformCoupons", JSON.stringify(updatedPlatformCoupons));
      }
    }
  };

  if (!mounted) return null;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any courses to your cart yet. Let's find something to learn!</p>
        <Button asChild className="h-14 px-8 text-lg font-bold bg-background-darkYellow hover:bg-yellow-600 text-white rounded-xl shadow-lg">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = (subtotal * discount) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  // Standard VAT rate (5.5%)
  const vatRate = 0.055;
  const vatAmount = subtotalAfterDiscount * vatRate;
  
  const total = subtotalAfterDiscount + vatAmount;
  // Convert total to minor units (cents/kobo)
  const minorTotal = Math.round(total * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      {/* Left Column: Payment Details */}
      <div className="lg:col-span-6">
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 space-y-10">
          <div className="border-b border-gray-100 pb-8">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Secure Checkout</h1>
            <p className="text-lg text-gray-500">Complete your enrollment below to instantly unlock course access.</p>
          </div>

          <div className="space-y-6">
            <GatewaySelector selected={gateway} onSelect={setGateway} />
          </div>

          <div className="pt-8 border-t border-gray-100 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Payment</h3>
              <p className="text-sm text-gray-500 mb-6">All transactions are secure and encrypted.</p>
            </div>
            
            <div className="max-w-md">
              {gateway === "paystack" && <PaystackButton email="student@example.com" amount={minorTotal} onSuccess={handlePaymentSuccess} />}
              {gateway === "flutterwave" && <FlutterwaveButton email="student@example.com" name="Jane Doe" amount={total} onSuccess={handlePaymentSuccess} />}
            </div>
            
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 pt-4">
              <Lock className="w-4 h-4" />
              256-bit SSL secure checkout
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-6">
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-none border-2 border-background-darkYellow/20 sticky top-28 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-background-darkYellow" />
          
          {/* Subtle gradient glow in background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-background-darkYellow/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              Order Summary
              <span className="flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 font-bold text-xs w-6 h-6 rounded-full ml-auto">{cartItems.length}</span>
            </h3>
            
            <div className="flex flex-col divide-y divide-gray-100/80 mb-8 pb-8 border-b border-gray-200 border-dashed">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 relative group py-5 first:pt-0 last:pb-0 items-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 p-1">
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      <div className="absolute inset-0 border border-black/5 rounded-xl"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center pr-2">
                    <h4 className="font-bold text-[15px] text-gray-900 leading-tight mb-1 truncate">{item.name}</h4>
                    <p className="text-[13px] font-medium text-gray-500">Lifetime Access</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-[15px] font-bold text-gray-900">${item.price.toFixed(2)}</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 pb-8 border-b border-gray-200 border-dashed text-[15px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600 font-medium animate-in fade-in duration-300">
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">VAT (5.5%)</span>
                <span className="font-bold text-gray-900">${vatAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-10">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">Amount Payable</span>
                <span className="text-2xl font-bold text-gray-900 tracking-tight leading-none">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100/80 shadow-inner">
              <CouponInput onValidated={(val, code) => {
                setDiscount(val);
                setAppliedCouponCode(code);
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
