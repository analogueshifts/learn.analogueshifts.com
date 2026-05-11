"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialNotifications = [
  { id: 1, title: "New Enrollment", message: "Sarah Jenkins enrolled in Fullstack Web Development.", time: "10m ago", read: false },
  { id: 2, title: "Course Approved", message: "Your course 'Advanced UI/UX' has been approved and is now live.", time: "2h ago", read: false },
  { id: 3, title: "New Review", message: "You received a 5-star review from Michael Chen.", time: "Yesterday", read: true },
  { id: 4, title: "Payout Processed", message: "Your weekly payout of $450.00 has been processed.", time: "3 days ago", read: true },
];

export default function TrainerNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
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
              <CardDescription>You have {notifications.filter(n => !n.read).length} unread messages.</CardDescription>
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <button onClick={markAllAsRead} className="text-sm font-semibold text-[#FFBB0A] hover:underline flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap pl-6 sm:pl-0">{notif.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
