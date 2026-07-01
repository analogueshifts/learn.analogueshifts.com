"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Percent, Trash2, Calendar, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
  courseId: string | null;
  course: { id: string; title: string } | null;
}

const DEFAULT_FORM = { code: "", discountType: "PERCENT", discountValue: "", expiresAt: "", maxUses: "" };

export default function CouponManagerPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((body) => body.success && setCoupons(body.data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discountValue) return;
    setIsCreating(true);
    const response = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.toUpperCase().trim(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      }),
    });
    const body = await response.json();
    setIsCreating(false);
    if (body.success) {
      setCoupons((prev) => [{ ...body.data, course: null }, ...prev]);
      setForm(DEFAULT_FORM);
      toast.success("Coupon created!");
    } else {
      toast.error(body.error ?? "Failed to create coupon");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    const response = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    const body = await response.json();
    if (body.success) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Coupon deleted");
    } else {
      toast.error(body.error ?? "Failed to delete coupon");
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Coupon Manager</h1>
        <p className="text-gray-500 mt-1">Create and manage discount codes for courses.</p>
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
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                  className="rounded-xl border-gray-200 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Type</label>
                  <select
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₦)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">
                    Value {form.discountType === "PERCENT" ? "(%)" : "(₦)"}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={form.discountType === "PERCENT" ? "100" : undefined}
                    placeholder={form.discountType === "PERCENT" ? "20" : "500"}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    required
                    className="rounded-xl border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Expiry Date (optional)</label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="rounded-xl border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Max Uses (optional)</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 100 (leave blank for unlimited)"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  className="rounded-xl border-gray-200"
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating || !form.code.trim() || !form.discountValue}
                className="w-full font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto mt-4 shadow-md"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Coupon"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-gray-200 shadow-sm rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl font-bold">Active Coupons</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading coupons...
              </div>
            ) : (
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
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                        No coupons yet. Create one above to get started.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((coupon) => {
                      const maxUses = coupon.maxUses ?? 0;
                      const usagePct = maxUses > 0 ? Math.min((coupon.usedCount / maxUses) * 100, 100) : 0;
                      const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();

                      return (
                        <tr key={coupon.id} className={`hover:bg-gray-50/50 transition-colors ${isExpired ? "opacity-50" : ""}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-blue-500" />
                              <span className="font-extrabold text-gray-900 tracking-wide">{coupon.code}</span>
                              {isExpired && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Expired</span>}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">
                              {coupon.courseId ? coupon.course?.title ?? "Specific Course" : "All Courses"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                              {coupon.discountType === "PERCENT" ? <Percent className="w-3 h-3 mr-1" /> : "₦"}
                              {coupon.discountValue}
                              {coupon.discountType === "PERCENT" && "%"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {maxUses > 0 ? (
                              <div className="w-32">
                                <div className="flex justify-between text-xs font-medium mb-1">
                                  <span className="text-gray-900">{coupon.usedCount} used</span>
                                  <span className="text-gray-500">{maxUses}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${usagePct >= 90 ? "bg-red-500" : usagePct >= 75 ? "bg-yellow-500" : "bg-blue-500"}`}
                                    style={{ width: `${usagePct}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">{coupon.usedCount} used · unlimited</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {coupon.expiresAt ? (
                              <div className="flex items-center text-gray-600 font-medium">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {new Date(coupon.expiresAt).toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">No expiry</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              onClick={() => handleDelete(coupon.id, coupon.code)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
