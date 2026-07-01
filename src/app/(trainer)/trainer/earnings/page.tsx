"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDownRight, HelpCircle, Loader2, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast, { Toaster } from "react-hot-toast";

interface EarningsData {
  commissionRate: number;
  totalGross: number;
  totalEarnings: number;
  refundedAmount: number;
  refundRate: number;
  pendingPayout: number;
  breakdown: { month: string; courseId: string; course: string; gross: number; earnings: number }[];
}

interface Payout {
  id: string;
  amount: number;
  method: string;
  period: string;
  status: string;
  createdAt: string;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
}

const DEFAULT_WITHDRAW = { amount: "", bankName: "", accountName: "", accountNumber: "" };

export default function TrainerEarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState(DEFAULT_WITHDRAW);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/trainer/earnings").then((res) => res.json()),
      fetch("/api/trainer/payouts").then((res) => res.json()),
    ])
      .then(([earningsBody, payoutsBody]) => {
        if (earningsBody.success) setEarnings(earningsBody.data);
        if (payoutsBody.success) setPayouts(payoutsBody.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleWithdraw = async () => {
    const amount = Number(withdrawForm.amount);
    if (!amount || !withdrawForm.bankName || !withdrawForm.accountName || !withdrawForm.accountNumber) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsWithdrawing(true);
    const response = await fetch("/api/trainer/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...withdrawForm, amount: Number(withdrawForm.amount) }),
    });
    const body = await response.json();
    setIsWithdrawing(false);
    if (body.success) {
      setPayouts((prev) => [body.data, ...prev]);
      setShowWithdrawDialog(false);
      setWithdrawForm(DEFAULT_WITHDRAW);
      toast.success("Withdrawal request submitted! Admin will process it shortly.");
    } else {
      toast.error(body.error ?? "Failed to submit withdrawal");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading earnings...
      </div>
    );
  }

  const available = Math.max(0, earnings?.pendingPayout ?? 0);

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8 pb-20">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Revenue Report</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Detailed breakdown of your course sales, refunds, and payouts.</p>
        </div>
        <Button
          onClick={() => setShowWithdrawDialog(true)}
          disabled={available <= 0}
          className="bg-background-darkYellow hover:bg-yellow-600 text-white font-bold shadow-md"
        >
          <Banknote className="w-4 h-4 mr-2" /> Request Withdrawal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
              Total Revenue <HelpCircle className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">₦{(earnings?.totalGross ?? 0).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
              Instructor Share ({Math.round((earnings?.commissionRate ?? 0.7) * 100)}%)
              <HelpCircle className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">₦{(earnings?.totalEarnings ?? 0).toLocaleString()}</div>
            <p className="text-xs font-medium text-gray-400">Your cut after platform fees</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">Refunds</div>
            <div className="text-3xl font-black text-gray-900 mb-2">₦{(earnings?.refundedAmount ?? 0).toLocaleString()}</div>
            <div className="flex items-center text-xs font-bold text-red-600 bg-red-50 w-max px-2 py-1 rounded-md">
              <ArrowDownRight className="w-3 h-3 mr-1" /> {(earnings?.refundRate ?? 0).toFixed(1)}% refund rate
            </div>
          </CardContent>
        </Card>

        <Card className="border border-background-darkYellow shadow-md rounded-xl bg-[#FFFBEC] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-background-darkYellow/10 rounded-bl-full" />
          <CardContent className="p-6">
            <div className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Available to Withdraw</div>
            <div className="text-3xl font-black text-background-darkYellow mb-2">₦{available.toLocaleString()}</div>
            <p className="text-xs font-bold text-gray-600">
              {available > 0 ? "Click 'Request Withdrawal' above" : "No balance yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
        <CardHeader className="border-b border-gray-100 p-6">
          <CardTitle className="text-lg font-bold text-gray-900">Earnings by Month & Course</CardTitle>
          <CardDescription>Gross revenue from successful orders</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!earnings || earnings.breakdown.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No revenue yet.</p>
          ) : (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earnings.breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} tickFormatter={(v) => `₦${v}`} />
                  <Tooltip cursor={{ fill: "#f3f4f6" }} contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="gross" fill="#111827" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold text-gray-900">Payout History</h2>
        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200 font-bold">
                <tr>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Bank Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payouts.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No payouts yet.</td></tr>
                ) : (
                  payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{payout.period}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {payout.bankName ? (
                          <div>
                            <p className="font-semibold">{payout.bankName}</p>
                            <p className="text-xs text-gray-400">{payout.accountName} · {payout.accountNumber}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${
                          payout.status === "PAID" ? "bg-green-100 text-green-700" :
                          payout.status === "FAILED" ? "bg-red-100 text-red-700" :
                          payout.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-900">₦{payout.amount.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold">Request Withdrawal</DialogTitle>
            <DialogDescription>
              Enter your bank details. Admin will process the transfer within 2–5 business days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-bold text-gray-900 block mb-1.5">Amount (₦)</label>
              <Input
                type="number"
                min="1"
                max={available}
                placeholder={`Max: ₦${available.toLocaleString()}`}
                value={withdrawForm.amount}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-900 block mb-1.5">Bank Name</label>
              <Input
                placeholder="e.g. Access Bank"
                value={withdrawForm.bankName}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-900 block mb-1.5">Account Name</label>
              <Input
                placeholder="e.g. John Doe"
                value={withdrawForm.accountName}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, accountName: e.target.value })}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-900 block mb-1.5">Account Number</label>
              <Input
                placeholder="e.g. 0123456789"
                value={withdrawForm.accountNumber}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                className="rounded-xl border-gray-200"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="w-full rounded-xl font-bold border-gray-200">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="w-full rounded-xl font-bold bg-background-darkYellow hover:bg-yellow-600 text-white"
            >
              {isWithdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
