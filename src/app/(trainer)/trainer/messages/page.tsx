"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Users, History, Megaphone, Loader2, Inbox, PenBox, CheckCircle, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

interface Course {
  id: string;
  title: string;
  _count?: { enrollments: number };
}

interface Announcement {
  id: string;
  title: string;
  course: string;
  audienceSize: number;
  createdAt: string;
}

interface InboxMessage {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  sender: { name: string; role: string };
}

export default function TrainerMessagesPage() {
  const [isSending, setIsSending] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [isLoadingInbox, setIsLoadingInbox] = useState(true);
  const [adminSubject, setAdminSubject] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [isSendingToAdmin, setIsSendingToAdmin] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/trainer/courses").then((res) => res.json()),
      fetch("/api/trainer/announcements").then((res) => res.json()),
    ])
      .then(([coursesBody, historyBody]) => {
        if (coursesBody.success) {
          setCourses(coursesBody.data);
          if (coursesBody.data.length > 0) setSelectedCourseId(coursesBody.data[0].id);
        }
        if (historyBody.success) setHistory(historyBody.data);
      })
      .finally(() => setIsLoading(false));

    loadInbox();
  }, []);

  const loadInbox = () => {
    setIsLoadingInbox(true);
    fetch("/api/messages")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setInbox(body.data);
      })
      .finally(() => setIsLoadingInbox(false));
  };

  const markAsRead = (id: string) => {
    setInbox((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    fetch(`/api/messages/${id}`, { method: "PATCH" });
  };

  const markAllAsRead = async () => {
    setInbox((prev) => prev.map((m) => ({ ...m, isRead: true })));
    await fetch("/api/messages/mark-all-read", { method: "POST" });
  };

  const handleSend = async () => {
    if (!selectedCourseId) {
      toast.error("Select a course first.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast.error("Please enter both a subject and message.");
      return;
    }

    setIsSending(true);
    const response = await fetch("/api/trainer/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: selectedCourseId, title: subject, body: message }),
    });
    const body = await response.json();
    setIsSending(false);

    if (body.success) {
      setSubject("");
      setMessage("");
      toast.success("Broadcast sent!");
      const course = courses.find((c) => c.id === selectedCourseId);
      setHistory((prev) => [
        { id: body.data.id, title: body.data.title, course: course?.title ?? "", audienceSize: course?._count?.enrollments ?? 0, createdAt: body.data.createdAt },
        ...prev,
      ]);
    } else {
      toast.error(body.error ?? "Failed to send broadcast");
    }
  };

  const handleSendToAdmin = async () => {
    if (!adminSubject.trim() || !adminMessage.trim()) {
      toast.error("Please enter a subject and message.");
      return;
    }

    setIsSendingToAdmin(true);
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: adminSubject, body: adminMessage }),
    });
    const body = await response.json();
    setIsSendingToAdmin(false);

    if (!body.success) {
      toast.error(body.error ?? "Failed to send message");
      return;
    }

    setAdminSubject("");
    setAdminMessage("");
    toast.success("Message sent to Admin!");
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const unreadCount = inbox.filter((m) => !m.isRead).length;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#FFBB0A]" />
          Messages
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">Broadcast updates to your students and stay in touch with the Admin team.</p>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="bg-muted/20 p-1 w-full max-w-md mb-6 rounded-xl">
          <TabsTrigger value="announcements" className="w-full rounded-lg font-bold data-[state=active]:bg-[#0F2942] data-[state=active]:text-white transition-all">
            <Megaphone className="w-4 h-4 mr-2" /> Course Announcements
          </TabsTrigger>
          <TabsTrigger value="admin" className="w-full rounded-lg font-bold data-[state=active]:bg-[#0F2942] data-[state=active]:text-white transition-all">
            <ShieldAlert className="w-4 h-4 mr-2" /> Admin {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-border/50 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/50 p-6 lg:p-8">
                <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#0F2942] dark:text-[#FFBB0A]" />
                  Compose Broadcast
                </CardTitle>
                <CardDescription>This message will be emailed to every student enrolled in the selected course.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 lg:p-8 space-y-6">

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Select Course</Label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full h-12 rounded-xl border border-border/50 bg-muted/20 px-4 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] transition-all"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title} ({c._count?.enrollments ?? 0} students)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Subject</Label>
                  <Input
                    placeholder="e.g. Important update regarding Chapter 3"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Message Body</Label>
                  <textarea
                    rows={8}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] transition-all resize-none"
                    placeholder="Type your message here..."
                  />
                </div>

              </CardContent>
              <CardFooter className="p-6 lg:p-8 bg-muted/5 border-t border-border/50 flex justify-between items-center">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Reaching {selectedCourse?._count?.enrollments ?? 0} students
                </p>
                <Button
                  className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
                  onClick={handleSend}
                  disabled={isSending}
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSending ? "Sending..." : "Send Broadcast"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden h-max">
              <CardHeader className="bg-muted/10 border-b border-border/50 p-6">
                <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                  <History className="w-5 h-5 text-muted-foreground" />
                  Recent Broadcasts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : history.length === 0 ? (
                  <p className="p-6 text-sm text-muted-foreground">No broadcasts sent yet.</p>
                ) : (
                  <div className="divide-y divide-border/50">
                    {history.map((b) => (
                      <div key={b.id} className="p-6 hover:bg-muted/30 transition-colors">
                        <h4 className="font-bold text-sm text-foreground line-clamp-1 mb-1">{b.title}</h4>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{b.course} • {new Date(b.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs font-bold text-muted-foreground">Sent to {b.audienceSize} students</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="admin" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-border/50 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/50 p-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-muted-foreground" /> Inbox
                  </CardTitle>
                  <CardDescription>Messages from the Admin team.</CardDescription>
                </div>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" className="font-bold border-border/50" onClick={markAllAsRead}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Mark All as Read
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingInbox ? (
                  <div className="p-12 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : inbox.length === 0 ? (
                  <p className="p-12 text-sm text-muted-foreground text-center">No messages yet.</p>
                ) : (
                  <div className="divide-y divide-border/50">
                    {inbox.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => !msg.isRead && markAsRead(msg.id)}
                        className={`p-6 hover:bg-muted/30 transition-colors cursor-pointer ${!msg.isRead ? 'bg-muted/10' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`font-bold text-sm ${!msg.isRead ? 'text-foreground' : 'text-foreground/80'}`}>{msg.sender.name}</span>
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className={`text-sm ${!msg.isRead ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>{msg.subject}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{msg.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden h-max">
              <CardHeader className="bg-muted/10 border-b border-border/50 p-6">
                <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                  <PenBox className="w-5 h-5 text-[#0F2942] dark:text-[#FFBB0A]" /> Message Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Input
                  placeholder="Subject"
                  value={adminSubject}
                  onChange={(e) => setAdminSubject(e.target.value)}
                  className="h-11 bg-muted/20 border-border/50 rounded-xl text-sm font-medium"
                />
                <textarea
                  rows={5}
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] resize-none"
                />
                <Button
                  className="w-full bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold h-11 rounded-xl shadow-lg"
                  onClick={handleSendToAdmin}
                  disabled={isSendingToAdmin}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSendingToAdmin ? "Sending..." : "Send to Admin"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
