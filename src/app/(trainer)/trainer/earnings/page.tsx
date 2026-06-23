"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
}

export default function TrainerEarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading earnings...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8 pb-20">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Revenue Report</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Detailed breakdown of your course sales, refunds, and payouts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
              Total Revenue
              <HelpCircle className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">${(earnings?.totalGross ?? 0).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
              Instructor Share ({Math.round((earnings?.commissionRate ?? 0.7) * 100)}%)
              <HelpCircle className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">${(earnings?.totalEarnings ?? 0).toLocaleString()}</div>
            <p className="text-xs font-medium text-gray-400">Your cut after platform fees</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
              Refunds
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">${(earnings?.refundedAmount ?? 0).toLocaleString()}</div>
            <div className="flex items-center text-xs font-bold text-red-600 bg-red-50 w-max px-2 py-1 rounded-md">
              <ArrowDownRight className="w-3 h-3 mr-1" /> {(earnings?.refundRate ?? 0).toFixed(1)}% refund rate
            </div>
          </CardContent>
        </Card>

        <Card className="border border-background-darkYellow shadow-md rounded-xl bg-[#FFFBEC] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-background-darkYellow/10 rounded-bl-full" />
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
              Pending Payout
            </div>
            <div className="text-3xl font-black text-background-darkYellow mb-2">${Math.max(0, earnings?.pendingPayout ?? 0).toLocaleString()}</div>
            <p className="text-xs font-bold text-gray-600">Awaiting processing by admin</p>
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
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                  />
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
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payouts.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No payouts processed yet.</td></tr>
                ) : (
                  payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{payout.period}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{payout.method.replace("_", " ")}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${
                          payout.status === 'PAID' ? 'bg-green-100 text-green-700' :
                          payout.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-900">${payout.amount.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
}
