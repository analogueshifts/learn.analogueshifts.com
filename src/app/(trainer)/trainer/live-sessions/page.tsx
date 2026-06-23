"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Video, Calendar as CalendarIcon, Users, Clock, MoreHorizontal, Link as LinkIcon, PlayCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

interface Course {
  id: string;
  title: string;
}

interface LiveSession {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  meetingLink: string;
  course: { id: string; title: string };
}

export default function TrainerLiveSessionsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [copied, setCopied] = useState(false);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/trainer/live-sessions").then((res) => res.json()),
      fetch("/api/trainer/courses").then((res) => res.json()),
    ])
      .then(([sessionsBody, coursesBody]) => {
        if (sessionsBody.success) setSessions(sessionsBody.data);
        if (coursesBody.success) setCourses(coursesBody.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const [form, setForm] = useState({ title: "", courseId: "", date: "", time: "", duration: "60", meetingLink: "" });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = async () => {
    if (!form.title || !form.courseId || !form.date || !form.time || !form.meetingLink) {
      toast.error("Fill in all fields, including a meeting link");
      return;
    }
    setIsCreating(true);
    const scheduledAt = new Date(`${form.date}T${form.time}`).toISOString();
    const response = await fetch("/api/trainer/live-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: form.courseId,
        title: form.title,
        scheduledAt,
        duration: Number(form.duration),
        meetingLink: form.meetingLink,
      }),
    });
    const body = await response.json();
    setIsCreating(false);
    if (body.success) {
      const course = courses.find((c) => c.id === form.courseId);
      setSessions((prev) => [{ ...body.data, course: { id: course?.id ?? "", title: course?.title ?? "" } }, ...prev]);
      toast.success("Session scheduled");
      setForm({ title: "", courseId: "", date: "", time: "", duration: "60", meetingLink: "" });
    } else {
      toast.error(body.error ?? "Failed to schedule session");
    }
  };

  const now = new Date();
  const upcoming = sessions.filter((s) => new Date(s.scheduledAt) >= now).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const past = sessions.filter((s) => new Date(s.scheduledAt) < now);
  const filteredSessions = activeTab === "upcoming" ? upcoming : activeTab === "past" ? past : [];
  const nextSession = upcoming[0];

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Live Sessions</h1>
          <p className="text-gray-500 mt-1">Schedule and manage your interactive classroom events.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-background-darkYellow hover:bg-yellow-600 text-white font-bold">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-6 rounded-3xl bg-white">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-extrabold text-gray-900">Schedule New Session</DialogTitle>
                <DialogDescription className="text-sm font-medium text-gray-500">
                  Create a new interactive classroom event for your students.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-900">Session Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Q&A: React State Management"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-900">Related Course</label>
                  <select
                    value={form.courseId}
                    onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900 appearance-none"
                  >
                    <option value="">Select a course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-900">Date</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-900">Time</label>
                    <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-900">Duration</label>
                    <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900 appearance-none">
                      <option value="30">30 mins</option>
                      <option value="45">45 mins</option>
                      <option value="60">60 mins</option>
                      <option value="90">90 mins</option>
                      <option value="120">120 mins</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-900">Meeting Link</label>
                  <input
                    type="text"
                    value={form.meetingLink}
                    onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateSession} disabled={isCreating} className="w-full h-12 rounded-xl font-bold bg-background-darkYellow hover:bg-yellow-600 text-white shadow-lg shadow-background-darkYellow/20">
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Schedule Event"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {nextSession && (
        <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full pointer-events-none" />
          <CardContent className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-2"></span>
                    Next Session
                  </span>
                  <span className="text-sm font-medium text-gray-400">{nextSession.course.title}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-white">{nextSession.title}</h2>

                <div className="flex flex-wrap items-center gap-6 text-gray-300 font-medium">
                  <div className="flex items-center"><CalendarIcon className="w-5 h-5 mr-2 text-gray-400" /> {new Date(nextSession.scheduledAt).toLocaleDateString()}</div>
                  <div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-gray-400" /> {new Date(nextSession.scheduledAt).toLocaleTimeString()} ({nextSession.duration} mins)</div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
                <Button asChild size="lg" className="bg-background-darkYellow hover:bg-yellow-500 text-white w-full text-lg font-bold shadow-lg shadow-background-darkYellow/20 transition-all">
                  <a href={nextSession.meetingLink} target="_blank" rel="noopener noreferrer">
                    <PlayCircle className="w-5 h-5 mr-2" /> Host Session
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white transition-all" onClick={() => handleCopyLink(nextSession.meetingLink)}>
                  {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> : <LinkIcon className="w-4 h-4 mr-2" />}
                  {copied ? "Link Copied!" : "Copy Invite Link"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-gray-200 shadow-sm rounded-2xl bg-white overflow-hidden">
        <div className="border-b border-gray-100 p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-gray-200/50 p-1">
              <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-bold">Upcoming</TabsTrigger>
              <TabsTrigger value="past" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-bold">Past Sessions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Date & Time</th>
                  <th className="px-6 py-4 font-bold">Session Details</th>
                  <th className="px-6 py-4 font-bold">Link</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-5 h-5 mx-auto animate-spin" /></td></tr>
                ) : filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No sessions found for this category.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5 align-top">
                        <div className="font-bold text-gray-900 mb-1">{new Date(session.scheduledAt).toLocaleDateString()}</div>
                        <div className="text-gray-500 flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date(session.scheduledAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-5 align-top max-w-[300px]">
                        <div className="text-[10px] font-bold text-background-darkYellow uppercase tracking-wider mb-1">{session.course.title}</div>
                        <div className="font-bold text-gray-900 text-[15px] truncate">{session.title}</div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <Button variant="outline" size="sm" onClick={() => handleCopyLink(session.meetingLink)} className="bg-white border-gray-200 text-gray-600 font-medium">
                          <Video className="w-3.5 h-3.5 mr-1.5" /> Copy Link
                        </Button>
                      </td>
                      <td className="px-6 py-5 align-top text-right space-x-2">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
