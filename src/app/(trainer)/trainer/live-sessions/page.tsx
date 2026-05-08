"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Video, Calendar as CalendarIcon, Users, Clock, MoreHorizontal, Link as LinkIcon, Edit2, PlayCircle, Settings, CheckCircle2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allSessions = [
  { id: 1, course: "Fullstack Web Development", title: "Q&A: React State Management", date: "Oct 15, 2026", time: "4:00 PM - 5:30 PM", platform: "Zoom", status: "Upcoming", attendees: 42 },
  { id: 2, course: "Advanced UI/UX", title: "Live Portfolio Review", date: "Oct 18, 2026", time: "2:00 PM - 3:00 PM", platform: "Google Meet", status: "Upcoming", attendees: 18 },
  { id: 3, course: "Python Bootcamp", title: "Week 1 Orientation", date: "Oct 22, 2026", time: "10:00 AM - 11:30 AM", platform: "Zoom", status: "Upcoming", attendees: 105 },
  { id: 4, course: "Fullstack Web Development", title: "Next.js App Router Deep Dive", date: "Sep 28, 2026", time: "3:00 PM - 4:30 PM", platform: "Zoom", status: "Past", attendees: 60 },
  { id: 5, course: "Python Bootcamp", title: "Machine Learning Setup", date: "Nov 05, 2026", time: "TBD", platform: "TBD", status: "Draft", attendees: 0 },
];

export default function TrainerLiveSessionsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [copied, setCopied] = useState(false);
  const [zoomConnected, setZoomConnected] = useState(true);
  const [meetConnected, setMeetConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [newPlatform, setNewPlatform] = useState('zoom');

  const handleConnectIntegration = (platform: string) => {
    setIsConnecting(platform);
    setTimeout(() => {
      setIsConnecting(null);
      if (platform === 'zoom') setZoomConnected(!zoomConnected);
      if (platform === 'meet') setMeetConnected(!meetConnected);
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://zoom.us/j/mock-session-link");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredSessions = allSessions.filter(session => session.status.toLowerCase() === activeTab);

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Live Sessions</h1>
          <p className="text-gray-500 mt-1">Schedule and manage your interactive classroom events.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white border-gray-200">
                <Settings className="w-4 h-4 mr-2" /> Integrations
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[460px] p-6 rounded-3xl">
              <DialogHeader className="mb-2">
                <DialogTitle className="text-xl font-extrabold text-gray-900">Connected Apps</DialogTitle>
                <DialogDescription className="text-sm font-medium text-gray-500">
                  Link your video conferencing accounts to automatically generate and sync meeting links for live sessions.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                {/* Zoom Integration */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-white shadow-sm hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-900">Zoom Meetings</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">Auto-generate Zoom links</p>
                    </div>
                  </div>
                  <Button 
                    variant={zoomConnected ? "outline" : "default"} 
                    size="sm" 
                    className={`font-bold transition-all w-24 ${zoomConnected ? "text-red-600 border-gray-200 hover:bg-red-50 hover:text-red-700" : "bg-gray-900 text-white hover:bg-gray-800"}`}
                    onClick={() => handleConnectIntegration('zoom')}
                    disabled={isConnecting === 'zoom'}
                  >
                    {isConnecting === 'zoom' ? 'Syncing...' : zoomConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>

                {/* Google Meet Integration */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-white shadow-sm hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                      <CalendarIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-900">Google Meet</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">Sync with Google Calendar</p>
                    </div>
                  </div>
                  <Button 
                    variant={meetConnected ? "outline" : "default"} 
                    size="sm" 
                    className={`font-bold transition-all w-24 ${meetConnected ? "text-red-600 border-gray-200 hover:bg-red-50 hover:text-red-700" : "bg-gray-900 text-white hover:bg-gray-800"}`}
                    onClick={() => handleConnectIntegration('meet')}
                    disabled={isConnecting === 'meet'}
                  >
                    {isConnecting === 'meet' ? 'Syncing...' : meetConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
                  <input type="text" placeholder="e.g. Q&A: React State Management" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-900">Related Course</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900 appearance-none">
                    <option value="" disabled>Select a course</option>
                    <option value="1">Fullstack Web Development</option>
                    <option value="2">Advanced UI/UX</option>
                    <option value="3">Python Bootcamp</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-900">Date</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-900">Time</label>
                    <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none transition-all font-medium text-gray-900" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-900">Platform Integration</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setNewPlatform('zoom')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all border-2 ${newPlatform === 'zoom' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <Video className="w-4 h-4" /> Zoom
                    </button>
                    <button 
                      onClick={() => setNewPlatform('meet')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all border-2 ${newPlatform === 'meet' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <CalendarIcon className="w-4 h-4" /> Google Meet
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button className="w-full h-12 rounded-xl font-bold bg-background-darkYellow hover:bg-yellow-600 text-white shadow-lg shadow-background-darkYellow/20">Schedule Event</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Hero: Next Session */}
      <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full pointer-events-none" />
        <CardContent className="p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-2"></span>
                  Starting in 15 mins
                </span>
                <span className="text-sm font-medium text-gray-400">Fullstack Web Development</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-white">Q&A: React State Management</h2>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-300 font-medium">
                <div className="flex items-center"><CalendarIcon className="w-5 h-5 mr-2 text-gray-400" /> Today, Oct 12</div>
                <div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-gray-400" /> 4:00 PM - 5:30 PM</div>
                <div className="flex items-center"><Users className="w-5 h-5 mr-2 text-gray-400" /> 42 Students Waiting</div>
              </div>
            </div>
            
            <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
              <Button size="lg" className="bg-background-darkYellow hover:bg-yellow-500 text-white w-full text-lg font-bold shadow-lg shadow-background-darkYellow/20 transition-all" onClick={() => alert("Launching Secure Virtual Classroom...")}>
                <PlayCircle className="w-5 h-5 mr-2" /> Host Session
              </Button>
              <Button size="lg" variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white transition-all" onClick={handleCopyLink}>
                {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> : <LinkIcon className="w-4 h-4 mr-2" />}
                {copied ? "Link Copied!" : "Copy Invite Link"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Table */}
      <Card className="border-gray-200 shadow-sm rounded-2xl bg-white overflow-hidden">
        <div className="border-b border-gray-100 p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-gray-200/50 p-1">
              <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-bold">Upcoming</TabsTrigger>
              <TabsTrigger value="past" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-bold">Past Sessions</TabsTrigger>
              <TabsTrigger value="drafts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-bold">Drafts</TabsTrigger>
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
                  <th className="px-6 py-4 font-bold">Platform</th>
                  <th className="px-6 py-4 font-bold">Registrants</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No sessions found for this category.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 align-top">
                      <div className="font-bold text-gray-900 mb-1">{session.date}</div>
                      <div className="text-gray-500 flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {session.time}</div>
                    </td>
                    <td className="px-6 py-5 align-top max-w-[300px]">
                      <div className="text-[10px] font-bold text-background-darkYellow uppercase tracking-wider mb-1">{session.course}</div>
                      <div className="font-bold text-gray-900 text-[15px] truncate">{session.title}</div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        <Video className="w-3.5 h-3.5 mr-1.5" /> {session.platform}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="font-bold text-gray-900 flex items-center">
                        <Users className="w-4 h-4 mr-1.5 text-gray-400" /> {session.attendees}
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top text-right space-x-2">
                      <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-600 hover:text-gray-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
