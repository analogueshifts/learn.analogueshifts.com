"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Users, History, Megaphone, Globe, Inbox, Search, CheckCircle, User as UserIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Audience = "ALL" | "STUDENTS" | "TRAINERS" | "INDIVIDUAL";

const AUDIENCES: { id: Audience; title: string }[] = [
  { id: "ALL", title: "All Registered Users" },
  { id: "TRAINERS", title: "All Trainers & Instructors" },
  { id: "STUDENTS", title: "All Enrolled Students" },
  { id: "INDIVIDUAL", title: "Specific User (Student/Trainer/Admin)" },
];

interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface InboxMessage {
  id: string;
  subject: string;
  body: string;
  audience: string;
  createdAt: string;
  isRead: boolean;
  sender: { name: string; role: string; avatar: string | null };
}

interface SentMessage {
  id: string;
  subject: string;
  body: string;
  audience: string;
  recipientName: string | null;
  createdAt: string;
  recipientCount: number;
  readCount: number;
}

export default function AdminMessagesPage() {
  const [isSending, setIsSending] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<Audience>("ALL");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [audienceCount, setAudienceCount] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userResults, setUserResults] = useState<UserOption[]>([]);

  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [isLoadingInbox, setIsLoadingInbox] = useState(true);
  const [sent, setSent] = useState<SentMessage[]>([]);
  const [inboxSearch, setInboxSearch] = useState("");

  const loadInbox = () => {
    setIsLoadingInbox(true);
    fetch("/api/messages")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setInbox(body.data);
      })
      .finally(() => setIsLoadingInbox(false));
  };

  const loadSent = () => {
    fetch("/api/messages?folder=sent")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setSent(body.data);
      });
  };

  useEffect(() => {
    loadInbox();
    loadSent();
  }, []);

  useEffect(() => {
    if (selectedAudience === "INDIVIDUAL") {
      setAudienceCount(selectedUser ? 1 : 0);
      return;
    }
    const roleParam = selectedAudience === "STUDENTS" ? "STUDENT" : selectedAudience === "TRAINERS" ? "TRAINER" : "";
    fetch(`/api/admin/users${roleParam ? `?role=${roleParam}` : ""}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setAudienceCount(body.data.length);
      });
  }, [selectedAudience, selectedUser]);

  useEffect(() => {
    if (selectedAudience !== "INDIVIDUAL" || !searchQuery.trim()) {
      setUserResults([]);
      return;
    }
    const handle = setTimeout(() => {
      fetch(`/api/admin/users?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((body) => {
          if (body.success) setUserResults(body.data);
        });
    }, 250);
    return () => clearTimeout(handle);
  }, [searchQuery, selectedAudience]);

  const markAsRead = (id: string) => {
    setInbox((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    fetch(`/api/messages/${id}`, { method: "PATCH" });
  };

  const markAllAsRead = async () => {
    setInbox((prev) => prev.map((m) => ({ ...m, isRead: true })));
    await fetch("/api/messages/mark-all-read", { method: "POST" });
  };

  const handleSend = async () => {
    if (selectedAudience === "INDIVIDUAL" && !selectedUser) {
      toast.error("Please select a user from the list.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast.error("Please enter both a subject and message.");
      return;
    }

    setIsSending(true);
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audience: selectedAudience,
        recipientId: selectedAudience === "INDIVIDUAL" ? selectedUser?.id : undefined,
        subject,
        body: message,
      }),
    });
    const body = await response.json();
    setIsSending(false);

    if (!body.success) {
      toast.error(body.error ?? "Failed to send broadcast");
      return;
    }

    setSubject("");
    setMessage("");
    setSearchQuery("");
    setSelectedUser(null);
    toast.success(selectedAudience === "INDIVIDUAL" ? "Message sent directly to user!" : "Broadcast sent successfully!");
    loadSent();
  };

  const filteredInbox = inbox.filter(
    (m) =>
      m.subject.toLowerCase().includes(inboxSearch.toLowerCase()) ||
      m.sender.name.toLowerCase().includes(inboxSearch.toLowerCase())
  );
  const unreadCount = inbox.filter((m) => !m.isRead).length;

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
                <Input
                  placeholder="Search messages, users, tickets..."
                  value={inboxSearch}
                  onChange={(e) => setInboxSearch(e.target.value)}
                  className="pl-10 h-10 bg-white dark:bg-muted/20 border-border/50 rounded-lg"
                />
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" className="w-full sm:w-auto font-bold border-border/50" onClick={markAllAsRead}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark All as Read
                </Button>
              )}
            </div>
            <div className="divide-y divide-border/50">
              {isLoadingInbox ? (
                <div className="p-12 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
              ) : filteredInbox.length === 0 ? (
                <p className="p-12 text-sm text-muted-foreground text-center">No messages yet.</p>
              ) : (
                filteredInbox.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => !msg.isRead && markAsRead(msg.id)}
                    className={`p-6 hover:bg-muted/30 transition-colors cursor-pointer flex gap-4 ${!msg.isRead ? 'bg-muted/10' : ''}`}
                  >
                    <div className="mt-1 shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        msg.sender.role === 'ADMIN' ? 'bg-red-100 text-red-600 dark:bg-red-950/30' :
                        msg.sender.role === 'TRAINER' ? 'bg-[#FFBB0A]/20 text-[#FFBB0A]' :
                        'bg-[#0F2942] text-white'
                      }`}>
                        <UserIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${!msg.isRead ? 'text-foreground' : 'text-foreground/80'}`}>{msg.sender.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-wide">{msg.sender.role.toLowerCase()}</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className={`text-sm ${!msg.isRead ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>{msg.subject}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{msg.body}</p>
                    </div>
                  </div>
                ))
              )}
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
                <CardDescription>Broadcasts deliver immediately to each recipient&apos;s dashboard inbox and notifications.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 lg:p-8 space-y-6">

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Target Audience</Label>
                  <select
                    value={selectedAudience}
                    onChange={(e) => {
                      setSelectedAudience(e.target.value as Audience);
                      setSelectedUser(null);
                      setSearchQuery("");
                    }}
                    className="w-full h-12 rounded-xl border border-border/50 bg-muted/20 px-4 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] transition-all"
                  >
                    {AUDIENCES.map(a => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>

                {selectedAudience === "INDIVIDUAL" && (
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
                    {isDropdownOpen && searchQuery.trim() && (
                      <div className="absolute z-20 w-full mt-1 bg-white dark:bg-[#1A1A1A] border border-border/50 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {userResults.length > 0 ? (
                          userResults.map(user => (
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
                              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{user.role.toLowerCase()}</span>
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
                  <Label className="text-sm font-bold text-foreground">Message Content</Label>
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
                  Reaching {audienceCount === null ? "…" : `~${audienceCount.toLocaleString()} user${audienceCount === 1 ? "" : "s"}`}
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
                {sent.length === 0 ? (
                  <p className="p-6 text-sm text-muted-foreground">No broadcasts sent yet.</p>
                ) : (
                  <div className="divide-y divide-border/50">
                    {sent.map((b) => {
                      const openRate = b.recipientCount > 0 ? Math.round((b.readCount / b.recipientCount) * 100) : 0;
                      const audienceLabel = b.audience === "INDIVIDUAL" ? (b.recipientName ?? "Individual") : AUDIENCES.find(a => a.id === b.audience)?.title ?? b.audience;
                      return (
                        <div key={b.id} className="p-6 hover:bg-muted/30 transition-colors">
                          <h4 className="font-bold text-sm text-foreground line-clamp-1 mb-1">{b.subject}</h4>
                          <p className="text-xs font-medium text-muted-foreground mb-3">{audienceLabel} • {new Date(b.createdAt).toLocaleDateString()}</p>
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-muted-foreground">Open Rate ({b.readCount}/{b.recipientCount})</span>
                            <span className="text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">{openRate}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
