"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className={`relative flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border ${selected === "paystack" ? "border-background-darkYellow bg-[#FFFBEC] ring-1 ring-background-darkYellow/20" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"}`}>
          <RadioGroupItem value="paystack" id="paystack" />
          <div className="flex-1">
            <Label htmlFor="paystack" className="cursor-pointer font-bold text-gray-900 text-base block mb-0.5">Paystack</Label>
            <span className="text-sm text-gray-500 block font-normal">Pay with cards, bank transfers, or USSD.</span>
          </div>
        </div>

        <div className={`relative flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border ${selected === "flutterwave" ? "border-background-darkYellow bg-[#FFFBEC] ring-1 ring-background-darkYellow/20" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"}`}>
          <RadioGroupItem value="flutterwave" id="flutterwave" />
          <div className="flex-1">
            <Label htmlFor="flutterwave" className="cursor-pointer font-bold text-gray-900 text-base block mb-0.5">Flutterwave</Label>
            <span className="text-sm text-gray-500 block font-normal">Secure payment via mobile money or card.</span>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
