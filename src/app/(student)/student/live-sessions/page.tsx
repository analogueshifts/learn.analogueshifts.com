"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar as CalendarIcon, Clock, Loader2, ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface LiveSession {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  meetingLink: string;
  course: { title: string };
  trainer: { name: string };
}

export default function StudentLiveSessionsPage() {
  const [now, setNow] = useState(new Date());
  const [upcoming, setUpcoming] = useState<LiveSession[]>([]);
  const [past, setPast] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/live-sessions/upcoming").then((r) => r.json()),
      fetch("/api/live-sessions/upcoming?past=true").then((r) => r.json()),
    ]).then(([upBody, pastBody]) => {
      if (upBody.success) setUpcoming(upBody.data);
      if (pastBody.success) setPast(pastBody.data);
    }).finally(() => setIsLoading(false));
  }, []);

  const formatCountdown = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - now.getTime();
    if (diff <= 0) return "Started";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (hours >= 24) return `Starts in ${Math.floor(hours / 24)}d`;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const isJoinEnabled = (targetDate: string) =>
    (new Date(targetDate).getTime() - now.getTime()) / (1000 * 60) <= 10;

  const nextSession = upcoming[0];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Live Sessions</h1>
        <p className="text-muted-foreground mt-1">Join your instructors for live interactive classes and Q&A sessions.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading sessions...
        </div>
      ) : nextSession ? (
        <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-gradient-to-r from-[#0F2942] to-gray-800 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full pointer-events-none" />
          <CardContent className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#FFBB0A] text-[#0F2942] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">Up Next</span>
                  <span className="text-sm font-medium text-gray-300">{nextSession.course.title}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-white">{nextSession.title}</h2>
                <div className="flex flex-wrap items-center gap-6 text-gray-300 font-medium">
                  <div className="flex items-center"><CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />{new Date(nextSession.scheduledAt).toLocaleDateString()}</div>
                  <div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-gray-400" />{new Date(nextSession.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ({nextSession.duration} mins)</div>
                  <div className="flex items-center text-gray-300">Instructor: {nextSession.trainer.name}</div>
                </div>
              </div>
              <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
                <div className="text-center mb-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Starts In</p>
                  <div className="text-3xl font-mono font-bold text-white tracking-wider">{formatCountdown(nextSession.scheduledAt)}</div>
                </div>
                <Button
                  size="lg"
                  disabled={!isJoinEnabled(nextSession.scheduledAt)}
                  asChild={isJoinEnabled(nextSession.scheduledAt)}
                  className={`w-full text-lg font-bold shadow-lg transition-all ${isJoinEnabled(nextSession.scheduledAt) ? "bg-[#FFBB0A] hover:bg-yellow-500 text-[#0F2942]" : "bg-white/10 text-white/50 cursor-not-allowed"}`}
                >
                  {isJoinEnabled(nextSession.scheduledAt) ? (
                    <a href={nextSession.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Video className="w-5 h-5 mr-2" /> Join Now
                    </a>
                  ) : (
                    <span><Video className="w-5 h-5 mr-2 inline" /> Join 10m Before</span>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-200 shadow-sm rounded-2xl">
          <CardContent className="p-12 text-center text-gray-400">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No upcoming live sessions</p>
            <p className="text-sm mt-1">Your instructors haven&apos;t scheduled any sessions yet.</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-muted/20 p-1 mb-6">
          <TabsTrigger value="upcoming" className="rounded-lg font-bold data-[state=active]:bg-white">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg font-bold data-[state=active]:bg-white">Past Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No upcoming sessions at the moment.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcoming.map((session) => {
                const joinable = isJoinEnabled(session.scheduledAt);
                return (
                  <Card key={session.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-[10px] font-bold text-[#FFBB0A] uppercase tracking-wider">{session.course.title}</div>
                        <div className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{formatCountdown(session.scheduledAt)}</div>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{session.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">Instructor: {session.trainer.name}</p>
                      <div className="flex flex-col gap-2 text-sm text-gray-600 mb-6">
                        <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2" />{new Date(session.scheduledAt).toLocaleString()}</span>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-2" />{session.duration} minutes</span>
                      </div>
                      {joinable ? (
                        <Button asChild className="w-full font-bold bg-[#0F2942] hover:bg-[#0F2942]/90 text-white">
                          <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Video className="w-4 h-4 mr-2" /> Join Session
                          </a>
                        </Button>
                      ) : (
                        <Button disabled className="w-full font-bold bg-gray-100 text-gray-400">
                          Available 10m Before
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No past sessions found.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {past.map((session) => (
                <Card key={session.id} className="border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="text-[10px] font-bold text-[#FFBB0A] uppercase tracking-wider mb-1">{session.course.title}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{session.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {new Date(session.scheduledAt).toLocaleDateString()} · {session.duration} mins · {session.trainer.name}
                    </p>
                    {session.meetingLink && (
                      <Button asChild variant="outline" size="sm" className="w-full font-bold border-gray-200">
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Session Link
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
