"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function TrainerNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setNotifications(body.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", { method: "PATCH" });
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <Bell className="w-8 h-8 text-[#FFBB0A]" />
          Notification Center
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">Stay updated on your course enrollments, reviews, and account alerts.</p>
      </div>
      </div>

      <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Alerts</CardTitle>
              <CardDescription>You have {unreadCount} unread messages.</CardDescription>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-sm font-semibold text-[#FFBB0A] hover:underline flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">You're all caught up!</h3>
              <p className="text-muted-foreground">You don't have any notifications right now.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/50">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => { if (!notif.read) markAsRead(notif.id) }}
                  className={`p-6 flex flex-col sm:flex-row gap-4 justify-between sm:items-center hover:bg-muted/30 transition-colors cursor-pointer ${!notif.read ? 'bg-muted/10' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${!notif.read ? 'bg-destructive ring-4 ring-destructive/20' : 'bg-transparent'}`} />
                    <div>
                      <h4 className={`text-base font-semibold ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xl">{notif.message}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap pl-6 sm:pl-0">{new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
