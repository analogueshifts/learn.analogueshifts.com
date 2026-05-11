"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Users, History, Megaphone, Inbox, Search, CheckCircle, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

const myCourses = [
  { id: "c1", title: "Fullstack Web Development", students: 1240 },
  { id: "c2", title: "Advanced UI/UX", students: 804 },
  { id: "all", title: "All Enrolled Students", students: 2044 },
  { id: "specific", title: "Specific Student", students: 1 },
];

const mockStudentsList = [
  { id: "s1", name: "Sarah Jenkins", email: "sarah.j@example.com" },
  { id: "s2", name: "Michael Chen", email: "m.chen@example.com" },
  { id: "s3", name: "Alice Johnson", email: "alice.j@example.com" },
  { id: "s4", name: "David Kim", email: "david.k@example.com" },
  { id: "s5", name: "Elena Rodriguez", email: "elena.r@example.com" },
];

const mockInbox = [
  { id: 1, sender: "System Admin", role: "admin", subject: "Important: Platform Terms Update", message: "Please review the updated payout terms before next month.", time: "10m ago", read: false },
  { id: 2, sender: "Sarah Jenkins", role: "student", subject: "Question regarding Module 4", message: "Hi Alex, I'm having trouble understanding the React hooks concept in module 4. Could you provide another example?", time: "2h ago", read: false },
  { id: 3, sender: "Michael Chen", role: "student", subject: "Assignment Submission Issue", message: "I keep getting an error when uploading my zip file.", time: "Yesterday", read: true },
];

export default function TrainerMessagesPage() {
  const [isSending, setIsSending] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("c1");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  // Custom Dropdown State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{name: string, email: string} | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSend = () => {
    if (selectedCourse === "specific" && !selectedStudent) {
      toast.error("Please select a student from the list.");
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
      setSelectedStudent(null);
      toast.success(selectedCourse === "specific" ? "Message sent directly to student!" : "Message successfully sent to all students!");
    }, 1500);
  };

  const selectedCourseData = myCourses.find(c => c.id === selectedCourse);
  
  const filteredStudents = mockStudentsList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#FFBB0A]" />
          Messages & Announcements
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">Manage your student inbox and broadcast important updates to your courses.</p>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="bg-muted/20 p-1 w-full max-w-sm mb-6 rounded-xl">
          <TabsTrigger value="inbox" className="w-full rounded-lg font-bold data-[state=active]:bg-[#0F2942] data-[state=active]:text-white transition-all">
            <Inbox className="w-4 h-4 mr-2" /> Inbox
          </TabsTrigger>
          <TabsTrigger value="broadcast" className="w-full rounded-lg font-bold data-[state=active]:bg-[#0F2942] data-[state=active]:text-white transition-all">
            <Megaphone className="w-4 h-4 mr-2" /> Broadcasts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
            <div className="border-b border-border/50 p-4 bg-muted/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-10 h-10 bg-white dark:bg-muted/20 border-border/50 rounded-lg" />
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto font-bold border-border/50">
                <CheckCircle className="w-4 h-4 mr-2" /> Mark All as Read
              </Button>
            </div>
            <div className="divide-y divide-border/50">
              {mockInbox.map((msg) => (
                <div key={msg.id} className={`p-6 hover:bg-muted/30 transition-colors cursor-pointer flex gap-4 ${!msg.read ? 'bg-muted/10' : ''}`}>
                  <div className="mt-1 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.role === 'admin' ? 'bg-red-100 text-red-600 dark:bg-red-950/30' : 'bg-[#0F2942] text-white'}`}>
                      {msg.role === 'admin' ? <ShieldAlert className="w-5 h-5" /> : <span className="font-bold">{msg.sender.charAt(0)}</span>}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${!msg.read ? 'text-foreground' : 'text-foreground/80'}`}>{msg.sender}</span>
                        {msg.role === 'admin' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">Admin</span>
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

        <TabsContent value="broadcast" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Composer */}
            <Card className="lg:col-span-2 border-border/50 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/50 p-6 lg:p-8">
                <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#0F2942] dark:text-[#FFBB0A]" />
                  Compose Broadcast
                </CardTitle>
                <CardDescription>This message will be sent via email and in-app notification to the selected students.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 lg:p-8 space-y-6">
                
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Select Audience</Label>
                  <select 
                    value={selectedCourse}
                    onChange={(e) => {
                      setSelectedCourse(e.target.value);
                      setSelectedStudent(null);
                      setSearchQuery("");
                    }}
                    className="w-full h-12 rounded-xl border border-border/50 bg-muted/20 px-4 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] transition-all"
                  >
                    {myCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.title} {c.id !== 'specific' && `(${c.students} students)`}</option>
                    ))}
                  </select>
                </div>

                {selectedCourse === "specific" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 relative">
                    <Label className="text-sm font-bold text-foreground">Select a Student</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsDropdownOpen(true);
                          setSelectedStudent(null);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                        className="pl-10 h-12 bg-white dark:bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" 
                      />
                    </div>
                    {isDropdownOpen && (
                      <div className="absolute z-20 w-full mt-1 bg-white dark:bg-[#1A1A1A] border border-border/50 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map(student => (
                            <div 
                              key={student.id} 
                              className="p-3 hover:bg-muted/50 cursor-pointer flex flex-col border-b border-border/50 last:border-0"
                              onClick={() => {
                                setSelectedStudent(student);
                                setSearchQuery(student.name);
                                setIsDropdownOpen(false);
                              }}
                            >
                              <span className="font-bold text-sm text-foreground">{student.name}</span>
                              <span className="text-xs text-muted-foreground">{student.email}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-sm text-muted-foreground text-center">No students found.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

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
                  Reaching {selectedCourseData?.students} students
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

            {/* Recent Broadcasts */}
            <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden h-max">
              <CardHeader className="bg-muted/10 border-b border-border/50 p-6">
                <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                  <History className="w-5 h-5 text-muted-foreground" />
                  Recent Broadcasts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {[
                    { title: "Welcome to the new semester!", audience: "All Students", date: "Oct 12", opens: "84%" },
                    { title: "Correction in Module 4 Video", audience: "Advanced UI/UX", date: "Sep 28", opens: "92%" },
                    { title: "Live Q&A Session Tomorrow", audience: "Fullstack Web Dev", date: "Sep 15", opens: "76%" },
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
                  <Button variant="ghost" className="w-full h-9 text-xs font-bold">View Message History</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
