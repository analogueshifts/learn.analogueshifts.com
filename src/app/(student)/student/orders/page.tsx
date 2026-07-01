"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { Loader2, ShoppingBag, RefreshCcw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

interface OrderCourse {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
}

interface OrderItem {
  id: string;
  price: number;
  course: OrderCourse;
}

interface Refund {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string;
  requestedAt: string;
}

interface Order {
  id: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  refunds: Refund[];
}

const DEFAULT_REFUND = { reason: "", bankName: "", accountName: "", accountNumber: "" };

export default function StudentOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refundForm, setRefundForm] = useState(DEFAULT_REFUND);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setOrders(body.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleRefundSubmit = async () => {
    if (!selectedOrder) return;
    if (!refundForm.reason || !refundForm.bankName || !refundForm.accountName || !refundForm.accountNumber) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    const response = await fetch("/api/refunds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: selectedOrder.id, ...refundForm }),
    });
    const body = await response.json();
    setIsSubmitting(false);
    if (body.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, refunds: [...o.refunds, { id: body.data.id, status: "PENDING", reason: refundForm.reason, requestedAt: new Date().toISOString() }] }
            : o
        )
      );
      setSelectedOrder(null);
      setRefundForm(DEFAULT_REFUND);
      toast.success("Refund request submitted! Admin will review it shortly.");
    } else {
      toast.error(body.error ?? "Failed to submit refund request");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <Toaster position="top-right" />

      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Orders & Refunds</h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">View your purchase history and request refunds.</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-400 mb-6">Your purchase history will appear here.</p>
          <Link href="/courses">
            <Button className="bg-background-darkYellow hover:bg-yellow-600 text-white font-bold">Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const activeRefund = order.refunds.find((r) => r.status !== "REJECTED");
            return (
              <Card key={order.id} className="border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                      <span className="font-mono text-sm text-gray-700">{order.id.slice(0, 16)}…</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span>
                      <span className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span>
                      <span className="font-black text-gray-900">₦{order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      {activeRefund ? (
                        <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                          activeRefund.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          activeRefund.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          Refund {activeRefund.status}
                        </span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-bold border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          onClick={() => { setSelectedOrder(order); setRefundForm(DEFAULT_REFUND); }}
                        >
                          <RefreshCcw className="w-3.5 h-3.5 mr-1.5" /> Request Refund
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4">
                        {item.course.thumbnailUrl ? (
                          <img
                            src={item.course.thumbnailUrl}
                            alt={item.course.title}
                            className="w-14 h-10 rounded-md object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-10 rounded-md bg-gray-200 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <Link href={`/courses/${item.course.slug}`} className="font-semibold text-gray-900 hover:underline text-sm truncate block">
                            {item.course.title}
                          </Link>
                        </div>
                        <span className="font-bold text-gray-700 text-sm shrink-0">₦{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold">Request a Refund</DialogTitle>
            <DialogDescription>
              Provide a reason and the bank account where you'd like to receive the refund.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-bold text-gray-900 block mb-1.5">Reason for Refund</label>
              <Textarea
                placeholder="Please describe why you're requesting a refund..."
                rows={3}
                value={refundForm.reason}
                onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                className="rounded-xl border-gray-200 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-900 block mb-1.5">Bank Name</label>
              <Input
                placeholder="e.g. GTBank"
                value={refundForm.bankName}
                onChange={(e) => setRefundForm({ ...refundForm, bankName: e.target.value })}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-900 block mb-1.5">Account Name</label>
              <Input
                placeholder="e.g. Jane Doe"
                value={refundForm.accountName}
                onChange={(e) => setRefundForm({ ...refundForm, accountName: e.target.value })}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-900 block mb-1.5">Account Number</label>
              <Input
                placeholder="e.g. 0123456789"
                value={refundForm.accountNumber}
                onChange={(e) => setRefundForm({ ...refundForm, accountNumber: e.target.value })}
                className="rounded-xl border-gray-200"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="w-full rounded-xl font-bold border-gray-200">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleRefundSubmit}
              disabled={isSubmitting}
              className="w-full rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Refund Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
