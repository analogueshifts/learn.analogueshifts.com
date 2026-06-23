"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUp, Calendar, CheckCircle2, Clock, FileText, UploadCloud, X, MessageSquare, Search, Eye, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import toast from "react-hot-toast";

interface Submission {
  id: string;
  fileUrl: string;
  fileName: string | null;
  grade: string | null;
  feedback: string | null;
  submittedAt: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  course: { id: string; title: string };
  submission: Submission | null;
}

function deriveStatus(assignment: Assignment): "pending" | "submitted" | "graded" {
  if (!assignment.submission) return "pending";
  if (assignment.submission.grade) return "graded";
  return "submitted";
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assignments")
      .then((res) => res.json())
      .then((body) => body.success && setAssignments(body.data))
      .finally(() => setIsLoading(false));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const courseTitles = Array.from(new Set(assignments.map((a) => a.course.title)));

  const filteredAssignments = assignments.filter((a) => {
    const status = deriveStatus(a);
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "all" || a.course.title === courseFilter;
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const { startUpload, isUploading } = useUploadThing("assignmentResourceUploader", {
    onClientUploadComplete: async (res) => {
      if (!res?.[0] || !activeUploadId) return;
      const response = await fetch(`/api/assignments/${activeUploadId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: res[0].serverData.url, fileName: res[0].serverData.name }),
      });
      const body = await response.json();
      if (body.success) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === activeUploadId ? { ...a, submission: body.data } : a))
        );
        toast.success("Assignment submitted!");
        setActiveUploadId(null);
      } else {
        toast.error(body.error ?? "Failed to submit assignment");
      }
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Graded</span>;
      case "submitted":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100"><FileUp className="w-3.5 h-3.5 mr-1" /> Submitted</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100"><Clock className="w-3.5 h-3.5 mr-1" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Coursework</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your deadlines, submit projects, and review grades.</p>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 focus:ring-[#FFBB0A] focus:border-[#FFBB0A] w-full"
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <select
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#FFBB0A] focus:border-[#FFBB0A] outline-none w-full sm:w-auto"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courseTitles.map((title) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
            <select
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#FFBB0A] focus:border-[#FFBB0A] outline-none w-full sm:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold">Assignment</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-5 h-5 mx-auto animate-spin" /></td></tr>
              ) : filteredAssignments.map((assignment) => {
                const status = deriveStatus(assignment);
                return (
                <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[10px] font-bold text-[#FFBB0A] uppercase tracking-wider mb-0.5">{assignment.course.title}</div>
                    <div className="font-bold text-[#0F2942] text-base">{assignment.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dialog open={activeUploadId === assignment.id} onOpenChange={(open) => setActiveUploadId(open ? assignment.id : null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className={`font-bold ${status === "pending" ? "bg-[#0F2942] hover:bg-[#0F2942]/90 text-[#FFBB0A]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        >
                          {status === "pending" ? (
                            <><UploadCloud className="w-3.5 h-3.5 mr-1.5" /> Submit Work</>
                          ) : status === "graded" ? (
                            <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> View Grade</>
                          ) : (
                            <><Eye className="w-3.5 h-3.5 mr-1.5" /> View Submission</>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] p-6 rounded-3xl bg-white">
                        <DialogHeader className="mb-4 border-b border-gray-100 pb-4">
                          <DialogTitle className="text-xl font-extrabold text-[#0F2942]">
                            {status === "pending" ? "Submit Assignment" : status === "graded" ? "Grade Result" : "Submission Details"}
                          </DialogTitle>
                          <p className="text-sm font-medium text-gray-500 mt-1">{assignment.course.title} - {assignment.title}</p>
                        </DialogHeader>

                        {assignment.description && (
                          <div className="mb-6">
                            <h4 className="text-[10px] font-extrabold text-[#0F2942] mb-2 uppercase tracking-widest">Instructions</h4>
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{assignment.description}</p>
                          </div>
                        )}

                        {status === "pending" && (
                          <div className="space-y-4">
                            <label className="border-2 border-dashed border-gray-300 hover:border-[#FFBB0A] bg-white hover:bg-[#FFBB0A]/5 transition-all duration-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer group shadow-sm hover:shadow-md">
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-6 h-6 text-[#FFBB0A] animate-spin mb-2" />
                                  <p className="text-sm font-extrabold text-[#0F2942]">Uploading...</p>
                                </>
                              ) : (
                                <>
                                  <div className="w-12 h-12 bg-gray-50 rounded-full shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-300 shrink-0 mb-3">
                                    <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-[#FFBB0A]" />
                                  </div>
                                  <p className="text-sm font-extrabold text-[#0F2942]">Click to upload or drag & drop</p>
                                  <p className="text-xs font-medium text-gray-400 mt-1">Max 32MB</p>
                                </>
                              )}
                              <input
                                type="file"
                                className="hidden"
                                disabled={isUploading}
                                onChange={(e) => e.target.files?.[0] && startUpload([e.target.files[0]])}
                              />
                            </label>
                          </div>
                        )}

                        {status === "submitted" && assignment.submission && (
                          <div className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center shrink-0">
                                <FileUp className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-extrabold text-[#0F2942]">{assignment.submission.fileName ?? "Submission"}</p>
                                <p className="text-xs font-medium text-gray-500 mt-0.5">Submitted on {new Date(assignment.submission.submittedAt).toLocaleString()}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">Under Review</span>
                          </div>
                        )}

                        {status === "graded" && assignment.submission && (
                          <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                              <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold text-[#0F2942] truncate">{assignment.submission.fileName ?? "Submission"}</p>
                                <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">Submitted on {new Date(assignment.submission.submittedAt).toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-extrabold text-emerald-900 flex items-center uppercase tracking-widest">
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> Final Grade
                                </h4>
                                <div className="bg-white px-3 py-1 rounded-xl shadow-sm border border-emerald-200">
                                  <span className="text-lg font-black text-emerald-700">{assignment.submission.grade}</span>
                                </div>
                              </div>
                              {assignment.submission.feedback && (
                                <div className="pt-3 border-t border-emerald-200/60">
                                  <h4 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest mb-1.5 flex items-center opacity-80">
                                    <MessageSquare className="w-3 h-3 mr-1.5" /> Instructor Feedback
                                  </h4>
                                  <p className="text-sm text-emerald-900 font-medium leading-relaxed">{assignment.submission.feedback}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              );})}
              {!isLoading && filteredAssignments.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500 font-medium bg-gray-50/30">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    No assignments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
