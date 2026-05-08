"use client";

import { ShoppingCart, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartDropdown() {
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-700 hover:text-background-darkYellow transition-colors flex items-center justify-center group outline-none">
          <ShoppingCart className="w-[22px] h-[22px] transition-transform group-hover:scale-110" />
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-background-darkYellow text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white translate-x-1 -translate-y-0.5">
              {cartItems.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-[1.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] border-gray-100/60" align="end" sideOffset={20}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-[1.5rem]">
          <h4 className="font-bold text-gray-900">Your Cart</h4>
          <span className="text-[11px] font-bold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200/60 shadow-sm">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </span>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <ShoppingCart className="w-10 h-10 mx-auto text-gray-200 mb-4" />
            <p className="text-sm font-medium">Your cart is currently empty.</p>
          </div>
        ) : (
          <div className="max-h-[320px] overflow-y-auto p-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 group relative items-center">
                <div className="w-16 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h5 className="text-[13px] font-bold text-gray-900 leading-tight mb-0.5 truncate">{item.name}</h5>
                  <p className="text-xs font-bold text-background-darkYellow">${item.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100/80 bg-white rounded-b-[1.5rem] space-y-4">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <Button asChild className="w-full h-12 text-base font-bold bg-primary-tan hover:bg-gray-900 text-white rounded-xl shadow-md transition-all hover:scale-[1.02]">
              <Link href="/checkout">Go to Checkout</Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
