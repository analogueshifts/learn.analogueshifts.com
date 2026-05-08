"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone } from "lucide-react";

export type PaymentGateway = "paystack" | "flutterwave";

interface GatewaySelectorProps {
  selected: PaymentGateway;
  onSelect: (gateway: PaymentGateway) => void;
  disabled?: boolean;
}

export default function GatewaySelector({ selected, onSelect, disabled }: GatewaySelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
      <RadioGroup
        value={selected}
        onValueChange={(val) => onSelect(val as PaymentGateway)}
        disabled={disabled}
        className="flex flex-col gap-4"
      >
        <div 
          onClick={() => onSelect("paystack")}
          className={`relative flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border-2 ${selected === "paystack" ? "border-background-darkYellow bg-yellow-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${selected === "paystack" ? "bg-white border-background-darkYellow/30 shadow-sm" : "bg-gray-50 border-gray-100"}`}>
              <CreditCard className={`w-6 h-6 ${selected === "paystack" ? "text-background-darkYellow" : "text-gray-400"}`} />
            </div>
            <div>
              <Label htmlFor="paystack" className="cursor-pointer font-bold text-gray-900 text-[15px] block">Paystack</Label>
              <span className="text-[13px] text-gray-500 font-medium">Cards, Bank Transfers, USSD</span>
            </div>
          </div>
          <RadioGroupItem value="paystack" id="paystack" className={`pointer-events-none w-5 h-5 ${selected === "paystack" ? "border-background-darkYellow text-background-darkYellow" : "border-gray-300"}`} />
        </div>

        <div 
          onClick={() => onSelect("flutterwave")}
          className={`relative flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border-2 ${selected === "flutterwave" ? "border-background-darkYellow bg-yellow-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${selected === "flutterwave" ? "bg-white border-background-darkYellow/30 shadow-sm" : "bg-gray-50 border-gray-100"}`}>
              <Smartphone className={`w-6 h-6 ${selected === "flutterwave" ? "text-background-darkYellow" : "text-gray-400"}`} />
            </div>
            <div>
              <Label htmlFor="flutterwave" className="cursor-pointer font-bold text-gray-900 text-[15px] block">Flutterwave</Label>
              <span className="text-[13px] text-gray-500 font-medium">Global Mobile Money, Cards</span>
            </div>
          </div>
          <RadioGroupItem value="flutterwave" id="flutterwave" className={`pointer-events-none w-5 h-5 ${selected === "flutterwave" ? "border-background-darkYellow text-background-darkYellow" : "border-gray-300"}`} />
        </div>
      </RadioGroup>
    </div>
  );
}
