"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Users, History, Megaphone, Loader2 } from "lucide-react";
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

export default function TrainerMessagesPage() {
  const [isSending, setIsSending] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

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

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#FFBB0A]" />
          Announcements
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">Broadcast important updates to a course&apos;s enrolled students via email.</p>
      </div>

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
    </div>
  );
}
