"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Users, History, Megaphone, Globe, Inbox, Search, CheckCircle, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";

const systemAudiences = [
  { id: "all", title: "All Registered Users", count: 15420 },
  { id: "trainers", title: "All Trainers & Instructors", count: 342 },
  { id: "students", title: "All Enrolled Students", count: 12045 },
  { id: "admins", title: "System Administrators", count: 8 },
  { id: "specific", title: "Specific User (Student/Trainer/Admin)", count: 1 },
];

const mockUsersList = [
  { id: "u1", name: "Alex (Trainer)", email: "alex@analogueshifts.com", role: "Trainer" },
  { id: "u2", name: "Sarah Jenkins", email: "sarah.j@example.com", role: "Student" },
  { id: "u3", name: "David Kim", email: "david.k@example.com", role: "Admin" },
  { id: "u4", name: "Michael Chen", email: "m.chen@example.com", role: "Student" },
  { id: "u5", name: "Elena Rodriguez", email: "elena.r@example.com", role: "Student" },
];

const mockAdminInbox = [
  { id: 1, sender: "Alex (Trainer)", role: "trainer", subject: "Payout Issue", message: "Hi Admin, my recent payout seems to be stuck in pending.", time: "30m ago", read: false },
  { id: 2, sender: "Sarah Jenkins", role: "student", subject: "Refund Request", message: "I purchased the wrong course by accident.", time: "1h ago", read: false },
  { id: 3, sender: "David (Admin)", role: "admin", subject: "Server Status", message: "Database maintenance will start at 2 AM tonight.", time: "Yesterday", read: true },
];

export default function AdminMessagesPage() {
  const [isSending, setIsSending] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  // Custom Dropdown State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<{name: string, email: string} | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSend = () => {
    if (selectedAudience === "specific" && !selectedUser) {
      toast.error("Please select a user from the list.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast.error("Please enter both a subject and message.");
      return;
    }
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSubject("");
      setMessage("");
      setSearchQuery("");
      setSelectedUser(null);
      toast.success(selectedAudience === "specific" ? "Message sent directly to user!" : "System Broadcast sent successfully!");
    }, 1500);
  };

  const selectedAudienceData = systemAudiences.find(a => a.id === selectedAudience);
  
  const filteredUsers = mockUsersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <Globe className="w-8 h-8 text-[#FFBB0A]" />
          Platform Communications
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">Manage platform-wide inbox and send global announcements to specific user segments.</p>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="bg-muted/20 p-1 w-full max-w-sm mb-6 rounded-xl">
          <TabsTrigger value="inbox" className="w-full rounded-lg font-bold data-[state=active]:bg-[#0F2942] data-[state=active]:text-white transition-all">
            <Inbox className="w-4 h-4 mr-2" /> Admin Inbox
          </TabsTrigger>
          <TabsTrigger value="broadcast" className="w-full rounded-lg font-bold data-[state=active]:bg-[#0F2942] data-[state=active]:text-white transition-all">
            <Megaphone className="w-4 h-4 mr-2" /> Global Broadcasts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
            <div className="border-b border-border/50 p-4 bg-muted/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search messages, users, tickets..." className="pl-10 h-10 bg-white dark:bg-muted/20 border-border/50 rounded-lg" />
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto font-bold border-border/50">
                <CheckCircle className="w-4 h-4 mr-2" /> Mark All as Read
              </Button>
            </div>
            <div className="divide-y divide-border/50">
              {mockAdminInbox.map((msg) => (
                <div key={msg.id} className={`p-6 hover:bg-muted/30 transition-colors cursor-pointer flex gap-4 ${!msg.read ? 'bg-muted/10' : ''}`}>
                  <div className="mt-1 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      msg.role === 'admin' ? 'bg-red-100 text-red-600 dark:bg-red-950/30' : 
                      msg.role === 'trainer' ? 'bg-[#FFBB0A]/20 text-[#FFBB0A]' : 
                      'bg-[#0F2942] text-white'
                    }`}>
                      <UserIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${!msg.read ? 'text-foreground' : 'text-foreground/80'}`}>{msg.sender}</span>
                        <span className="px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-wide">{msg.role}</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{msg.time}</span>
                    </div>
                    <h4 className={`text-sm ${!msg.read ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>{msg.subject}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="broadcast" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Composer */}
            <Card className="xl:col-span-2 border-border/50 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/50 p-6 lg:p-8">
                <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#0F2942] dark:text-[#FFBB0A]" />
                  Compose Global Broadcast
                </CardTitle>
                <CardDescription>Broadcasts bypass standard notification preferences and deliver immediately via email and dashboard alerts.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 lg:p-8 space-y-6">
                
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Target Audience</Label>
                  <select 
                    value={selectedAudience}
                    onChange={(e) => {
                      setSelectedAudience(e.target.value);
                      setSelectedUser(null);
                      setSearchQuery("");
                    }}
                    className="w-full h-12 rounded-xl border border-border/50 bg-muted/20 px-4 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] transition-all"
                  >
                    {systemAudiences.map(a => (
                      <option key={a.id} value={a.id}>{a.title} {a.id !== 'specific' && `(~${a.count.toLocaleString()} users)`}</option>
                    ))}
                  </select>
                </div>

                {selectedAudience === "specific" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 relative">
                    <Label className="text-sm font-bold text-foreground">Select a User</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsDropdownOpen(true);
                          setSelectedUser(null);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                        className="pl-10 h-12 bg-white dark:bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" 
                      />
                    </div>
                    {isDropdownOpen && (
                      <div className="absolute z-20 w-full mt-1 bg-white dark:bg-[#1A1A1A] border border-border/50 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map(user => (
                            <div 
                              key={user.id} 
                              className="p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center border-b border-border/50 last:border-0"
                              onClick={() => {
                                setSelectedUser(user);
                                setSearchQuery(user.name);
                                setIsDropdownOpen(false);
                              }}
                            >
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-foreground">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{user.role}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-sm text-muted-foreground text-center">No users found.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Broadcast Subject</Label>
                  <Input 
                    placeholder="e.g. Platform Maintenance Schedule"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" 
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Message Content (Markdown Supported)</Label>
                  <textarea 
                    rows={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] transition-all resize-none"
                    placeholder="Write your announcement here..."
                  />
                </div>

              </CardContent>
              <CardFooter className="p-6 lg:p-8 bg-muted/5 border-t border-border/50 flex justify-between items-center">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Reaching {selectedAudience === 'specific' ? '1 specific user' : `~${selectedAudienceData?.count.toLocaleString()} users`}
                </p>
                <Button 
                  className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
                  onClick={handleSend}
                  disabled={isSending}
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSending ? "Sending..." : "Send Broadcast Now"}
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Broadcasts */}
            <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden h-max">
              <CardHeader className="bg-muted/10 border-b border-border/50 p-6">
                <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                  <History className="w-5 h-5 text-muted-foreground" />
                  Broadcast History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {[
                    { title: "System Scheduled Maintenance", audience: "All Users", date: "Oct 24", opens: "68%" },
                    { title: "New Trainer Guidelines Fall 2023", audience: "Trainers", date: "Sep 12", opens: "94%" },
                    { title: "Important: Update your payout details", audience: "Trainers", date: "Aug 05", opens: "98%" },
                    { title: "Welcome to the new AnalogueShifts!", audience: "All Users", date: "Jan 01", opens: "82%" },
                  ].map((b, i) => (
                    <div key={i} className="p-6 hover:bg-muted/30 transition-colors">
                      <h4 className="font-bold text-sm text-foreground line-clamp-1 mb-1">{b.title}</h4>
                      <p className="text-xs font-medium text-muted-foreground mb-3">{b.audience} • {b.date}</p>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-muted-foreground">Open Rate</span>
                        <span className="text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">{b.opens}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border/50">
                  <Button variant="ghost" className="w-full h-9 text-xs font-bold">View Full Analytics</Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
