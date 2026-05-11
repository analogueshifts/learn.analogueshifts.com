"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Inbox, Megaphone, Search, ShieldAlert, PenBox } from "lucide-react";
import toast from "react-hot-toast";

const mockMessages = [
  { id: 1, sender: "System Admin", role: "admin", subject: "Welcome to AnalogueShifts!", message: "We are thrilled to have you here. Please check out the platform documentation to get started.", time: "Oct 1", read: true },
  { id: 2, sender: "Sarah Jenkins", role: "trainer", subject: "Important update regarding Chapter 3", message: "Hi everyone, I have uploaded a new supplementary PDF for chapter 3. Please review it before our next live session.", time: "Yesterday", read: false },
  { id: 3, sender: "Gary Simon", role: "trainer", subject: "Portfolio Submission feedback", message: "Great job on your portfolio! I have left some specific notes on the alignment of the hero section.", time: "2 hours ago", read: false },
];

export default function StudentMessagesPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("instructor-1");
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please enter a subject and message.");
      return;
    }
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSubject("");
      setMessage("");
      toast.success("Message sent to your instructor!");
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#FFBB0A]" />
          Messages & Announcements
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">Stay in touch with your instructors and read important platform announcements.</p>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="bg-muted/20 p-1 w-full max-w-sm mb-6 rounded-xl">
          <TabsTrigger value="inbox" className="w-full rounded-lg font-bold data-[state=active]:bg-[#0F2942] data-[state=active]:text-white transition-all">
            <Inbox className="w-4 h-4 mr-2" /> Inbox
          </TabsTrigger>
          <TabsTrigger value="compose" className="w-full rounded-lg font-bold data-[state=active]:bg-[#0F2942] data-[state=active]:text-white transition-all">
            <PenBox className="w-4 h-4 mr-2" /> Compose
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-6">
          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
            <div className="border-b border-border/50 p-4 bg-muted/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-10 h-10 bg-white dark:bg-muted/20 border-border/50 rounded-lg" />
              </div>
            </div>
            <div className="divide-y divide-border/50">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`p-6 hover:bg-muted/30 transition-colors cursor-pointer flex gap-4 ${!msg.read ? 'bg-[#FFBB0A]/5' : ''}`}>
                  <div className="mt-1 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-[#0F2942] text-white'}`}>
                      {msg.role === 'admin' ? <Megaphone className="w-5 h-5" /> : <span className="font-bold">{msg.sender.charAt(0)}</span>}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${!msg.read ? 'text-foreground' : 'text-foreground/80'}`}>{msg.sender}</span>
                        {msg.role === 'admin' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wide">Platform</span>
                        )}
                        {msg.role === 'trainer' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide">Instructor</span>
                        )}
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

        <TabsContent value="compose">
          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden max-w-3xl">
            <CardHeader className="bg-muted/10 border-b border-border/50 p-6 lg:p-8">
              <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                <PenBox className="w-5 h-5 text-[#0F2942] dark:text-[#FFBB0A]" />
                Message Instructor
              </CardTitle>
              <CardDescription>Send a direct message to your course instructor.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">Select Instructor</label>
                <select 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full h-12 rounded-xl border border-border/50 bg-muted/20 px-4 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942]"
                >
                  <option value="instructor-1">Sarah Jenkins (Fullstack Web Dev)</option>
                  <option value="instructor-2">Gary Simon (UI/UX Design)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">Subject</label>
                <Input 
                  placeholder="e.g. Question about Module 4 Assignment"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] rounded-xl text-base font-medium" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">Message</label>
                <textarea 
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] resize-none"
                  placeholder="Type your question here..."
                />
              </div>

              <Button 
                className="w-full bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold h-12 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
                onClick={handleSend}
                disabled={isSending}
              >
                <Send className="w-5 h-5 mr-2" />
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
