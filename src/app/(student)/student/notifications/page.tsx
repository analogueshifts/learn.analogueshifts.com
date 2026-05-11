"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle2, Circle, Clock, MoreVertical, Trash2, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const initialNotifications = [
  { id: 1, title: "Upcoming Live Session", message: "Your Advanced React class starts in 15 minutes. Join the virtual classroom now to get settled before the instructor begins.", time: "Just now", read: false, type: "alert" },
  { id: 2, title: "Course Material Updated", message: "A new module has been unlocked: 'State Management Patterns'. Log in to review the latest video and quiz materials.", time: "2 hours ago", read: false, type: "info" },
  { id: 3, title: "Assignment Graded", message: "Instructor Sarah evaluated your Final Project submission. You scored 95%! Check out the feedback left on your document.", time: "Yesterday", read: true, type: "success" },
  { id: 4, title: "Certificate Earned", message: "Congratulations! You have successfully earned a certificate in Frontend Basics. You can download and share it from your Certificates tab.", time: "3 days ago", read: true, type: "success" },
  { id: 5, title: "Subscription Renewal", message: "Your pro student subscription will renew automatically in 7 days. Ensure your payment method is up to date.", time: "1 week ago", read: true, type: "info" },
]

export default function StudentNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-4 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F2942] dark:text-white">Notifications</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Stay updated on your courses, assignments, and account alerts.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead}
            variant="outline"
            className="shrink-0 border-border/50 shadow-sm text-sm"
          >
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            Mark all as read
          </Button>
        )}
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border/50 flex flex-row items-center justify-between py-4">
          <div>
            <CardTitle className="text-lg">All Alerts</CardTitle>
            <CardDescription>You have {unreadCount} unread messages</CardDescription>
          </div>
          <Bell className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">You're all caught up!</h3>
              <p className="text-muted-foreground">You don't have any notifications right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-6 transition-colors duration-200 group flex gap-4 items-start",
                    !notif.read ? "bg-muted/10" : "hover:bg-muted/5"
                  )}
                >
                  <div className="shrink-0 mt-1">
                    {!notif.read ? (
                      <Circle className="w-3 h-3 fill-destructive text-destructive" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <h4 className={cn(
                        "text-base font-semibold truncate", 
                        !notif.read ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {notif.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.time}
                        </span>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {!notif.read && (
                              <DropdownMenuItem onClick={() => markAsRead(notif.id)} className="cursor-pointer">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => deleteNotification(notif.id)}
                              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <p className={cn(
                      "text-sm leading-relaxed max-w-3xl",
                      !notif.read ? "text-muted-foreground" : "text-muted-foreground/80"
                    )}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
