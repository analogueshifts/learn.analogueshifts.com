"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const revenueData = [
  { name: "Nov 1", revenue: 120 }, { name: "Nov 5", revenue: 350 }, 
  { name: "Nov 10", revenue: 200 }, { name: "Nov 15", revenue: 800 }, 
  { name: "Nov 20", revenue: 650 }, { name: "Nov 25", revenue: 1200 },
  { name: "Nov 30", revenue: 950 },
];

export default function TrainerEarningsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8 pb-20">
      
      {/* Enterprise Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Revenue Report</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Detailed breakdown of your course sales, refunds, and payouts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-gray-200 text-gray-700 font-bold hidden sm:flex">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <Button variant="ghost" size="sm" className="text-xs font-bold bg-gray-100 text-gray-900 rounded-md">Last 30 Days</Button>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-500 rounded-md">This Year</Button>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-500 rounded-md">All Time</Button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Row (Utilitarian & Clean) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
              Total Revenue
              <HelpCircle className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">$12,450.00</div>
            <div className="flex items-center text-xs font-bold text-green-600 bg-green-50 w-max px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +14.5% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
              Instructor Share (70%)
              <HelpCircle className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">$8,715.00</div>
            <p className="text-xs font-medium text-gray-400">Your cut after platform fees</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
              Refunds
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">$340.00</div>
            <div className="flex items-center text-xs font-bold text-red-600 bg-red-50 w-max px-2 py-1 rounded-md">
              <ArrowDownRight className="w-3 h-3 mr-1" /> 2.7% refund rate
            </div>
          </CardContent>
        </Card>

        <Card className="border border-background-darkYellow shadow-md rounded-xl bg-[#FFFBEC] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-background-darkYellow/10 rounded-bl-full" />
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
              Next Payout
            </div>
            <div className="text-3xl font-black text-background-darkYellow mb-2">$4,250.00</div>
            <p className="text-xs font-bold text-gray-600 mb-4">Scheduled for Dec 1, 2026</p>
            <Button size="sm" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg shadow-sm">
              Manage Payouts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Area */}
      <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
        <CardHeader className="border-b border-gray-100 p-6">
          <CardTitle className="text-lg font-bold text-gray-900">Revenue Over Time</CardTitle>
          <CardDescription>Daily gross revenue across all published courses</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                />
                <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payout Settings Form */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Payout Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-lg font-bold text-gray-900">Bank Account</CardTitle>
              <CardDescription>Direct deposit to your bank account.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Account Holder Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Routing Number</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400" placeholder="110000000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Account Number</label>
                <input type="password" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400" placeholder="••••••••4321" />
              </div>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg mt-2">Save Bank Details</Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-lg font-bold text-gray-900">PayPal Connection</CardTitle>
              <CardDescription>Receive payouts directly to your PayPal account.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">PayPal Email Address</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400" placeholder="trainer@example.com" />
              </div>
              <div className="pt-6">
                <Button variant="outline" className="w-full border-blue-600 text-blue-700 font-bold hover:bg-blue-50">Connect PayPal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200 font-bold">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Transaction Type</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4 text-right">Amount (Gross)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { date: "Nov 30, 2026", type: "Sale", course: "Fullstack Web Development", student: "alex_dev99", amount: "+$99.99", isRefund: false },
                  { date: "Nov 30, 2026", type: "Sale", course: "Advanced UI/UX", student: "sarah_designs", amount: "+$79.99", isRefund: false },
                  { date: "Nov 28, 2026", type: "Refund", course: "Python Data Science", student: "mike_data", amount: "-$89.99", isRefund: true },
                  { date: "Nov 25, 2026", type: "Sale", course: "Fullstack Web Development", student: "chris_codes", amount: "+$99.99", isRefund: false },
                  { date: "Nov 22, 2026", type: "Payout", course: "—", student: "—", amount: "-$3,400.00", isRefund: true, isPayout: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{row.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${
                        row.type === 'Sale' ? 'bg-green-100 text-green-700' :
                        row.type === 'Refund' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{row.course}</td>
                    <td className="px-6 py-4 text-gray-500">{row.student}</td>
                    <td className={`px-6 py-4 text-right font-black ${
                      row.isRefund ? 'text-gray-900' : 'text-green-600'
                    }`}>
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Showing 5 of 142 transactions</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-white text-gray-600 font-bold" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-white text-gray-900 font-bold">Next</Button>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
