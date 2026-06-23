"use client"

import React, { useState, useMemo } from "react"
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

export interface RevenueTransaction {
  amount: number
  gateway: string
  date: string
  status: string
}

function groupTransactions(transactions: RevenueTransaction[], timeframe: "daily" | "weekly" | "monthly") {
  const successful = transactions.filter((t) => t.status === "SUCCESS")
  const groups: Record<string, { paystack: number; flutterwave: number; stripe: number }> = {}

  for (const tx of successful) {
    const date = new Date(tx.date)
    let key: string
    if (timeframe === "daily") {
      key = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    } else if (timeframe === "weekly") {
      const week = Math.ceil(date.getDate() / 7)
      key = `${date.toLocaleDateString(undefined, { month: "short" })} Wk${week}`
    } else {
      key = date.toLocaleDateString(undefined, { month: "short", year: "numeric" })
    }
    if (!groups[key]) groups[key] = { paystack: 0, flutterwave: 0, stripe: 0 }
    const gatewayKey = tx.gateway.toLowerCase() as "paystack" | "flutterwave" | "stripe"
    if (gatewayKey in groups[key]) groups[key][gatewayKey] += tx.amount
  }

  return Object.entries(groups).map(([name, values]) => ({ name, ...values }))
}

export function RevenueChart({ transactions = [] }: { transactions?: RevenueTransaction[] }) {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily")
  const [gateway, setGateway] = useState<"all" | "paystack" | "flutterwave">("all")

  const data = useMemo(() => groupTransactions(transactions, timeframe), [transactions, timeframe])

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
