"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Percent, Trash2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CouponManagerPage() {
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SUMMER20", type: "percentage", value: 20, expiry: "2026-08-31", scope: "global", usedCount: 45, maxUses: 100 },
    { id: 2, code: "WELCOME10", type: "fixed", value: 10, expiry: "2026-12-31", scope: "course_specific", usedCount: 150, maxUses: 500 },
  ]);

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    expiry: "",
    scope: "global",
    maxUses: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon = {
      id: Date.now(),
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: Number(formData.value),
      expiry: formData.expiry,
      scope: formData.scope,
      usedCount: 0,
      maxUses: Number(formData.maxUses),
    };
    setCoupons([...coupons, newCoupon]);
    setFormData({ code: "", type: "percentage", value: "", expiry: "", scope: "global", maxUses: "" });
  };

  const handleDelete = (id: number) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Coupon Manager</h1>
          <p className="text-gray-500 mt-1">Create and manage discount codes for courses.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-gray-200 shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Create Coupon
            </CardTitle>
            <CardDescription>Generate a new promotional code.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Code</label>
                <Input 
                  placeholder="e.g. SUMMER20" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})} 
                  required 
                  className="rounded-xl border-gray-200 focus:ring-blue-600 focus:border-blue-600 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Type</label>
                  <select 
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Value</label>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="20" 
                    value={formData.value} 
                    onChange={(e) => setFormData({...formData, value: e.target.value})} 
                    required 
                    className="rounded-xl border-gray-200 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Expiry Date</label>
                <Input 
                  type="date" 
                  value={formData.expiry} 
                  onChange={(e) => setFormData({...formData, expiry: e.target.value})} 
                  required 
                  className="rounded-xl border-gray-200 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Scope</label>
                  <select 
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    value={formData.scope}
                    onChange={(e) => setFormData({...formData, scope: e.target.value})}
                  >
                    <option value="global">Global (All Courses)</option>
                    <option value="course_specific">Specific Course</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Max Uses</label>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="100" 
                    value={formData.maxUses} 
                    onChange={(e) => setFormData({...formData, maxUses: e.target.value})} 
                    required 
                    className="rounded-xl border-gray-200 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto mt-4 shadow-md transition-all">
                Create Coupon
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-gray-200 shadow-sm rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl font-bold">Active Coupons</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Code</th>
                  <th className="px-6 py-4 font-bold">Discount</th>
                  <th className="px-6 py-4 font-bold">Usage</th>
                  <th className="px-6 py-4 font-bold">Expiry</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((coupon) => {
                  const usagePercent = Math.min((coupon.usedCount / coupon.maxUses) * 100, 100);
                  
                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-blue-500" />
                          <span className="font-extrabold text-gray-900 tracking-wide">{coupon.code}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">
                          {coupon.scope === 'global' ? 'All Courses' : 'Specific Course'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                          {coupon.type === 'percentage' ? <Percent className="w-3 h-3 mr-1" /> : '$'}{coupon.value}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="flex justify-between text-xs font-medium mb-1">
                            <span className="text-gray-900">{coupon.usedCount} used</span>
                            <span className="text-gray-500">{coupon.maxUses} total</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 75 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                              style={{ width: `${usagePercent}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-600 font-medium">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(coupon.expiry).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No coupons found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
