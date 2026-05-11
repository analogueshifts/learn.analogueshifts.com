"use client"

import React, { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const dummyDataDaily = [
  { name: "Mon", paystack: 4000, flutterwave: 2400 },
  { name: "Tue", paystack: 3000, flutterwave: 1398 },
  { name: "Wed", paystack: 2000, flutterwave: 9800 },
  { name: "Thu", paystack: 2780, flutterwave: 3908 },
  { name: "Fri", paystack: 1890, flutterwave: 4800 },
  { name: "Sat", paystack: 2390, flutterwave: 3800 },
  { name: "Sun", paystack: 3490, flutterwave: 4300 },
]

const dummyDataWeekly = [
  { name: "Week 1", paystack: 14000, flutterwave: 12400 },
  { name: "Week 2", paystack: 13000, flutterwave: 11398 },
  { name: "Week 3", paystack: 12000, flutterwave: 19800 },
  { name: "Week 4", paystack: 12780, flutterwave: 13908 },
]

const dummyDataMonthly = [
  { name: "Jan", paystack: 44000, flutterwave: 42400 },
  { name: "Feb", paystack: 43000, flutterwave: 41398 },
  { name: "Mar", paystack: 42000, flutterwave: 49800 },
  { name: "Apr", paystack: 42780, flutterwave: 43908 },
  { name: "May", paystack: 41890, flutterwave: 44800 },
  { name: "Jun", paystack: 42390, flutterwave: 43800 },
]

export function RevenueChart() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily")
  const [gateway, setGateway] = useState<"all" | "paystack" | "flutterwave">("all")

  const data =
    timeframe === "daily"
      ? dummyDataDaily
      : timeframe === "weekly"
      ? dummyDataWeekly
      : dummyDataMonthly

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Revenue Overview</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="space-x-1">
            <Button
              variant={timeframe === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("daily")}
            >
              Daily
            </Button>
            <Button
              variant={timeframe === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={timeframe === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("monthly")}
            >
              Monthly
            </Button>
          </div>
          <Select value={gateway} onValueChange={(val: any) => setGateway(val)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Gateway" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gateways</SelectItem>
              <SelectItem value="paystack">Paystack</SelectItem>
              <SelectItem value="flutterwave">Flutterwave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Legend />
              {(gateway === "all" || gateway === "paystack") && (
                <Line
                  type="monotone"
                  dataKey="paystack"
                  stroke="#0F2942"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0F2942" }}
                  activeDot={{ r: 6, fill: "#0F2942", stroke: "#fff", strokeWidth: 2 }}
                />
              )}
              {(gateway === "all" || gateway === "flutterwave") && (
                <Line
                  type="monotone"
                  dataKey="flutterwave"
                  stroke="#FFBB0A"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#FFBB0A" }}
                  activeDot={{ r: 6, fill: "#FFBB0A", stroke: "#fff", strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
