"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UserDetailPage() {
  const params = useParams()
  const { id } = params as { id: string }

  const [role, setRole] = useState("Student")

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">Manage user profile and history. (ID: {id})</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="text-destructive">Ban User</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>User Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Trainer">Trainer</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Joined At</Label>
                <p className="text-sm font-medium">October 12, 2023</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Last Login</Label>
                <p className="text-sm font-medium">2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>
              <TabsContent value="courses" className="mt-4 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Enrolled Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Advanced React Patterns</TableCell>
                      <TableCell>45%</TableCell>
                      <TableCell>Oct 15, 2023</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Next.js 14 Masterclass</TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>Nov 02, 2023</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="orders" className="mt-4 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-992</TableCell>
                      <TableCell>$49.99</TableCell>
                      <TableCell><Badge>Paid</Badge></TableCell>
                      <TableCell>Oct 15, 2023</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="activity" className="mt-4">
                <div className="space-y-4">
                  {[
                    { text: "Logged in from IP 192.168.1.1", time: "2 hours ago" },
                    { text: "Completed lesson 'Routing in Next.js'", time: "3 hours ago" },
                    { text: "Updated profile picture", time: "1 day ago" }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <p className="text-sm">{log.text}</p>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
