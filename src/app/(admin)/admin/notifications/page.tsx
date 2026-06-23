"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface Notification {
  id: string;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  title: string;
  message: string;
  actionUrl: string | null;
  read: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((res) => res.json())
      .then((body) => body.success && setNotifications(body.data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => fetch(`/api/admin/notifications/${n.id}`, { method: "PATCH" })));
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All alerts marked as read");
  };

  const handleMarkAsRead = async (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif?.read) return;
    await fetch(`/api/admin/notifications/${id}`, { method: "PATCH" });
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 pb-20">
      <Toaster position="top-right" />
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors bg-muted/30 hover:bg-muted/60 px-4 py-2 rounded-lg"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <Bell className="w-8 h-8 text-[#FFBB0A]" />
          System Alerts
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">Monitor platform events, security alerts, and administrative actions.</p>
      </div>

      <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Alerts</CardTitle>
              <CardDescription>You have {notifications.filter(n => !n.read).length} unread alerts.</CardDescription>
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-semibold text-[#FFBB0A] hover:underline flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : notifications.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">No alerts yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border/50">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`p-6 flex flex-col sm:flex-row gap-4 justify-between sm:items-center hover:bg-muted/30 transition-colors cursor-pointer ${!notif.read ? 'bg-muted/10' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-300 ${!notif.read ? 'bg-destructive ring-4 ring-destructive/20' : 'bg-transparent'}`} />
                    <div>
                      <h4 className={`text-base font-semibold transition-colors duration-300 ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xl">{notif.message}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap pl-6 sm:pl-0">{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
