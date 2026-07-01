"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Calendar,
  Settings,
  Home,
  LogOut,
  Bell,
  Search,
  User,
  PlayCircle,
  MessageSquare,
  FileText,
  Trophy,
  ShoppingBag
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import NavLogo from "@/assets/images/nav-logo.svg"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/student/my-courses", icon: PlayCircle },
  { name: "Live Sessions", href: "/student/live-sessions", icon: Calendar },
  { name: "Assignments", href: "/student/assignments", icon: FileText },
  { name: "Achievements", href: "/student/achievements", icon: Trophy },
  { name: "Messages", href: "/student/messages", icon: MessageSquare },
  { name: "Orders & Refunds", href: "/student/orders", icon: ShoppingBag },
  { name: "Certificates", href: "/student/certificates", icon: Award },
]

interface StudentNotificationItem {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [studentName, setStudentName] = React.useState("Student User")
  const [notifications, setNotifications] = React.useState<StudentNotificationItem[]>([])
  const unreadCount = notifications.filter(n => !n.read).length

  React.useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setNotifications(body.data)
      })
  }, [])

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    fetch(`/api/notifications/${id}`, { method: "PATCH" })
  }

  React.useEffect(() => {
    if (session?.user?.name) {
      setStudentName(session.user.name);
    } else {
      const storedUser = localStorage.getItem('pendingUserRegistration');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) {
            setStudentName(parsed.name);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, [session]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#09090b]">
      {/* Premium Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-64 flex-col border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="flex h-16 shrink-0 items-center border-b border-border/50 px-6">
          <Link href="/student/dashboard" className="flex items-center gap-3 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            <Image
              src={NavLogo}
              alt="AnalogueShifts Logo"
              className="w-32 h-auto"
            />
          </Link>
        </div>
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Learning Portal
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white shadow-sm text-[#0F2942] border border-border/50 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 font-semibold"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-[#FFBB0A]" : "text-muted-foreground group-hover:text-foreground")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Navigation Header */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 shadow-sm">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">Search courses</label>
              <Search
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground/50"
                aria-hidden="true"
              />
              <input
                id="search-field"
                className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm"
                placeholder="Search your courses..."
                type="search"
                name="search"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              
              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground transition-colors relative outline-none">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background"></span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 border-border/50 shadow-xl rounded-xl overflow-hidden mt-2">
                  <DropdownMenuLabel className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
                    <span className="font-bold text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-[#0F2942] text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount} New</span>
                    )}
                  </DropdownMenuLabel>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            "p-4 border-b border-border/50 last:border-0 hover:bg-muted/50 cursor-pointer transition-colors",
                            !notif.read ? "bg-muted/10" : ""
                          )}
                          onClick={() => {
                            if (!notif.read) markNotificationRead(notif.id);
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={cn("text-sm font-semibold", !notif.read ? "text-foreground" : "text-muted-foreground")}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{new Date(notif.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-border/50 bg-muted/10">
                    <DropdownMenuItem asChild className="p-0">
                      <Link href="/student/notifications" className="w-full">
                        <Button variant="ghost" className="w-full h-8 text-xs font-semibold text-[#0F2942] dark:text-[#FFBB0A]">
                          View All Notifications
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border/60" aria-hidden="true" />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-x-3 cursor-pointer hover:bg-muted/50 p-1.5 rounded-full transition-colors outline-none">
                    <Avatar className="h-8 w-8 border border-border/50 shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${studentName}`} />
                      <AvatarFallback>{studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center">
                      <span className="text-sm font-semibold leading-none text-foreground truncate max-w-[120px]" title={studentName}>{studentName}</span>
                      <span className="text-[10px] font-medium leading-none text-muted-foreground mt-1">Student</span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 border-border/50 shadow-xl rounded-xl mt-2">
                  <div className="px-2 py-2 mb-2 border-b border-border/50 flex flex-col">
                    <span className="text-sm font-bold text-foreground truncate" title={studentName}>{studentName}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">Learner</span>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                    <Link href="/student/profile" className="flex items-center">
                      <User className="mr-2 w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                    <Link href="/courses" className="flex items-center">
                      <Home className="mr-2 w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Browse Courses</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-2" />
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-md text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                    onClick={() => {
                      localStorage.removeItem('pendingUserRegistration');
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <LogOut className="mr-2 w-4 h-4" />
                    <span className="font-medium">Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  )
}
