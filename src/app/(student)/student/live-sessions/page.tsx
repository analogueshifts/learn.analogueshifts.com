"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar as CalendarIcon, Users, Clock, PlayCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const upcomingSessions = [
  { 
    id: 1, 
    course: "Fullstack Web Development", 
    title: "Q&A: React State Management", 
    scheduledAt: new Date(Date.now() + 15 * 60000).toISOString(), // 15 mins from now
    duration: "90 mins", 
    instructor: "Sarah Jenkins" 
  },
  { 
    id: 2, 
    course: "Advanced UI/UX", 
    title: "Live Portfolio Review", 
    scheduledAt: new Date(Date.now() + 24 * 60 * 60000).toISOString(), // Tomorrow
    duration: "60 mins", 
    instructor: "Gary Simon" 
  },
];

const pastSessions = [
  { id: 3, course: "Fullstack Web Development", title: "Next.js App Router Deep Dive", date: "Sep 28, 2026", duration: "90 mins", instructor: "Sarah Jenkins", recordingUrl: "#" },
];

export default function StudentLiveSessionsPage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (targetDate: string) => {
    const target = new Date(targetDate).getTime();
    const current = now.getTime();
    const diff = target - current;

    if (diff <= 0) return "Started";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isJoinEnabled = (targetDate: string) => {
    const target = new Date(targetDate).getTime();
    const current = now.getTime();
    const diffMins = (target - current) / (1000 * 60);
    return diffMins <= 10; // Enable 10 mins before
  };

  const nextSession = upcomingSessions[0];
  const nextSessionDiff = new Date(nextSession.scheduledAt).getTime() - now.getTime();
  const nextSessionJoinable = isJoinEnabled(nextSession.scheduledAt);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Live Sessions</h1>
        <p className="text-muted-foreground mt-1">Join your instructors for live interactive classes and Q&A sessions.</p>
      </div>

      <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-gradient-to-r from-[#0F2942] to-gray-800 text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full pointer-events-none" />
        <CardContent className="p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#FFBB0A] text-[#0F2942] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center shadow-sm">
                  Up Next
                </span>
                <span className="text-sm font-medium text-gray-300">{nextSession.course}</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-white">{nextSession.title}</h2>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-300 font-medium">
                <div className="flex items-center"><CalendarIcon className="w-5 h-5 mr-2 text-gray-400" /> {new Date(nextSession.scheduledAt).toLocaleDateString()}</div>
                <div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-gray-400" /> {new Date(nextSession.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({nextSession.duration})</div>
                <div className="flex items-center"><Users className="w-5 h-5 mr-2 text-gray-400" /> Instructor: {nextSession.instructor}</div>
              </div>
            </div>
            
            <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
              <div className="text-center mb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Starts In</p>
                <div className="text-3xl font-mono font-bold text-white tracking-wider">{formatCountdown(nextSession.scheduledAt)}</div>
              </div>
              <Button 
                size="lg" 
                disabled={!nextSessionJoinable}
                className={`w-full text-lg font-bold shadow-lg transition-all ${nextSessionJoinable ? 'bg-[#FFBB0A] hover:bg-yellow-500 text-[#0F2942]' : 'bg-white/10 text-white/50 cursor-not-allowed'}`} 
                onClick={() => alert("Joining Classroom...")}
              >
                <Video className="w-5 h-5 mr-2" /> {nextSessionJoinable ? "Join Now" : "Join 10m Before"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-muted/20 p-1 mb-6">
          <TabsTrigger value="upcoming" className="rounded-lg font-bold data-[state=active]:bg-white">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg font-bold data-[state=active]:bg-white">Past Recordings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingSessions.map(session => {
              const joinable = isJoinEnabled(session.scheduledAt);
              return (
                <Card key={session.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[10px] font-bold text-[#FFBB0A] uppercase tracking-wider">{session.course}</div>
                      <div className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{formatCountdown(session.scheduledAt)}</div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">{session.title}</h3>
                    <div className="flex flex-col gap-2 text-sm text-gray-600 mb-6">
                      <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2" /> {new Date(session.scheduledAt).toLocaleString()}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {session.duration}</span>
                    </div>
                    <Button 
                      disabled={!joinable}
                      className={`w-full font-bold ${joinable ? 'bg-[#0F2942] hover:bg-[#0F2942]/90 text-white' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {joinable ? "Join Session" : "Available 10m Before"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastSessions.map(session => (
              <Card key={session.id} className="border-border/50 shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative group cursor-pointer" onClick={() => alert("Playing recording...")}>
                  <PlayCircle className="w-12 h-12 text-gray-400 group-hover:text-[#FFBB0A] transition-colors z-10" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                </div>
                <CardContent className="p-5">
                  <div className="text-[10px] font-bold text-[#FFBB0A] uppercase tracking-wider mb-1">{session.course}</div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{session.title}</h3>
                  <p className="text-xs text-gray-500 mt-2">Recorded {session.date} • {session.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
