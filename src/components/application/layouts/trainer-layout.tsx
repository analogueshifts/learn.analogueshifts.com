"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  BarChart3, 
  DollarSign, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/trainer/courses", icon: BookOpen },
  { name: "Live Sessions", href: "/trainer/live-sessions", icon: Video },
  { name: "Analytics", href: "/trainer/analytics", icon: BarChart3 },
  { name: "Earnings", href: "/trainer/earnings", icon: DollarSign },
];

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
        w-64 bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0 justify-between">
          <Link href="/trainer/dashboard" className="font-bold text-xl text-primary-tan">
            Trainer<span className="text-background-darkYellow">Hub</span>
          </Link>
          <button className="lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                  ${isActive 
                    ? "bg-background-darkYellow/10 text-background-darkYellow" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-background-darkYellow" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3" />
              Exit to App
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shrink-0 lg:hidden sticky top-0 z-30">
          <button 
            className="text-gray-500 hover:text-gray-900"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-lg text-primary-tan ml-4">
            Trainer<span className="text-background-darkYellow">Hub</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
