"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  BarChart, 
  DollarSign, 
  Home,
  LogOut,
  Menu,
  X,
  User,
  Search,
  Bell,
  MessageSquare,
  Settings,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NavLogo from "@/assets/images/nav-logo.svg";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/trainer/courses", icon: BookOpen },
  { name: "Assignments", href: "/trainer/assignments", icon: FileText },
  { name: "Messages", href: "/trainer/messages", icon: MessageSquare },
  { name: "Live Sessions", href: "/trainer/live-sessions", icon: Video },
  { name: "Earnings", href: "/trainer/earnings", icon: DollarSign },
  { name: "Analytics", href: "/trainer/analytics", icon: BarChart },
];

const mockNotifications = [
  { id: 1, title: "New Message from System Admin", message: "Please review the updated payout terms before next month.", time: "1m ago", read: false },
  { id: 2, title: "New Enrollment", message: "Sarah Jenkins enrolled in Fullstack Web Development.", time: "10m ago", read: false },
  { id: 3, title: "Course Approved", message: "Your course 'Advanced UI/UX' has been approved and is now live.", time: "2h ago", read: false },
  { id: 4, title: "New Review", message: "You received a 5-star review from Michael Chen.", time: "Yesterday", read: true },
];

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [trainerName, setTrainerName] = useState("Alex");
  const [unreadCount, setUnreadCount] = useState(mockNotifications.filter(n => !n.read).length);

  useEffect(() => {
    const storedUser = localStorage.getItem('pendingUserRegistration');
    let parsed: any = { role: "Trainer" };
    if (storedUser) {
      try {
        parsed = { ...JSON.parse(storedUser), role: "Trainer" };
        if (parsed.name) {
          setTrainerName(parsed.name.split(' ')[0]);
        }
      } catch (e) {
        // ignore
      }
    }
    localStorage.setItem('pendingUserRegistration', JSON.stringify(parsed));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border/50 flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 justify-between">
          <Link href="/trainer/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src={NavLogo}
              alt="AnalogueShifts Logo"
              className="w-32 h-auto"
            />
          </Link>
          <button className="lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Overview
          </div>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
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
                <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-[#FFBB0A]" : "text-muted-foreground group-hover:text-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Premium Top Navigation Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 shadow-sm">
          <button 
            className="text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
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
                placeholder="Search courses, students, or analytics..."
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
                    {mockNotifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "p-4 border-b border-border/50 last:border-0 hover:bg-muted/50 cursor-pointer transition-colors",
                          !notif.read ? "bg-muted/10" : ""
                        )}
                        onClick={() => {
                          if (!notif.read) setUnreadCount(prev => Math.max(0, prev - 1));
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={cn("text-sm font-semibold", !notif.read ? "text-foreground" : "text-muted-foreground")}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{notif.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-border/50 bg-muted/10">
                    <DropdownMenuItem asChild className="p-0">
                      <Link href="/trainer/notifications" className="w-full">
                        <Button variant="ghost" className="w-full h-8 text-xs font-semibold text-[#0F2942] dark:text-[#FFBB0A]">
                          View All Notifications
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border/60" aria-hidden="true" />
              
              {/* Profile Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-x-3 cursor-pointer hover:bg-muted/50 p-1.5 rounded-full transition-colors outline-none">
                    <Avatar className="h-8 w-8 border border-border/50 shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${trainerName}`} />
                      <AvatarFallback>{trainerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center">
                      <span className="text-sm font-semibold leading-none text-foreground truncate max-w-[120px]" title={trainerName}>{trainerName}</span>
                      <span className="text-[10px] font-medium leading-none text-muted-foreground mt-1">Instructor</span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 border-border/50 shadow-xl rounded-xl mt-2">
                  <div className="px-2 py-2 mb-2 border-b border-border/50 flex flex-col">
                    <span className="text-sm font-bold text-foreground truncate" title={trainerName}>{trainerName}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">Instructor Account</span>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                    <Link href="/trainer/profile" className="flex items-center">
                      <User className="mr-2 w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                    <Link href="/" className="flex items-center">
                      <Home className="mr-2 w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">View Website</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-2" />
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-md text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                    onClick={() => {
                      localStorage.removeItem('pendingUserRegistration');
                      window.location.href = '/';
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

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
