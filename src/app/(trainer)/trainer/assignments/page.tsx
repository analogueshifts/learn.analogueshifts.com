"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Search, CheckCircle2, Edit3, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface Submission {
  id: string;
  fileUrl: string;
  fileName: string | null;
  grade: string | null;
  feedback: string | null;
  submittedAt: string;
  student: { id: string; name: string; email: string };
  assignmentTitle: string;
  course: { id: string; title: string };
}

export default function TrainerAssignmentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trainer/submissions")
      .then((res) => res.json())
      .then((body) => body.success && setSubmissions(body.data))
      .finally(() => setIsLoading(false));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeGradingId, setActiveGradingId] = useState<string | null>(null);
  const [tempGrade, setTempGrade] = useState("");
  const [tempFeedback, setTempFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredSubmissions = submissions.filter((sub) =>
    sub.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGradeSubmit = async () => {
    if (!activeGradingId) return;
    setIsSaving(true);
    const response = await fetch(`/api/trainer/submissions/${activeGradingId}/grade`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade: tempGrade, feedback: tempFeedback || undefined }),
    });
    const body = await response.json();
    setIsSaving(false);
    if (body.success) {
      setSubmissions((prev) => prev.map((sub) => (sub.id === activeGradingId ? { ...sub, ...body.data } : sub)));
      toast.success("Grade submitted");
      setActiveGradingId(null);
    } else {
      toast.error(body.error ?? "Failed to submit grade");
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Assignment Submissions</h1>
          <p className="text-gray-500 mt-1">Review student work, assign grades, and provide feedback.</p>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by student or assignment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 focus:ring-background-darkYellow focus:border-background-darkYellow w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold">Student</th>
                <th className="px-6 py-4 font-bold">Assignment</th>
                <th className="px-6 py-4 font-bold">Submission</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-5 h-5 mx-auto animate-spin" /></td></tr>
              ) : filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{submission.student.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{new Date(submission.submittedAt).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[10px] font-bold text-background-darkYellow uppercase tracking-wider mb-0.5">{submission.course.title}</div>
                    <div className="font-bold text-gray-900">{submission.assignmentTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs font-bold border-gray-200 text-gray-700 bg-white hover:bg-gray-50">
                      <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        {submission.fileName ?? "View file"}
                      </a>
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    {submission.grade ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {submission.grade}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">
                        Needs Grading
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dialog open={activeGradingId === submission.id} onOpenChange={(open) => {
                      if (open) {
                        setActiveGradingId(submission.id);
                        setTempGrade(submission.grade || "");
                        setTempFeedback(submission.feedback || "");
                      } else {
                        setActiveGradingId(null);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" className={`font-bold ${submission.grade ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-background-darkYellow text-white hover:bg-yellow-600"}`}>
                          <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                          {submission.grade ? "Edit Grade" : "Grade"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] p-6 rounded-3xl bg-white">
                        <DialogHeader className="mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <DialogTitle className="text-xl font-extrabold text-gray-900">Grade Submission</DialogTitle>
                              <p className="text-sm font-medium text-gray-500 mt-1">{submission.student.name} - {submission.assignmentTitle}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild className="h-8 text-xs font-bold border-gray-200">
                              <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="w-3.5 h-3.5 mr-1.5" /> Download Work
                              </a>
                            </Button>
                          </div>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Score / Grade</label>
                            <Input
                              placeholder="e.g. 95/100 or A-"
                              value={tempGrade}
                              onChange={(e) => setTempGrade(e.target.value)}
                              className="rounded-xl border-gray-200 focus:ring-background-darkYellow focus:border-background-darkYellow"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Instructor Feedback</label>
                            <textarea
                              rows={4}
                              placeholder="Provide constructive feedback..."
                              value={tempFeedback}
                              onChange={(e) => setTempFeedback(e.target.value)}
                              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none resize-none font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Button
                            variant="outline"
                            className="w-full rounded-xl font-bold border-gray-200 text-gray-600"
                            onClick={() => setActiveGradingId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="w-full rounded-xl font-bold bg-background-darkYellow hover:bg-yellow-600 text-white shadow-lg shadow-background-darkYellow/20"
                            onClick={handleGradeSubmit}
                            disabled={!tempGrade || isSaving}
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Grade"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No submissions found matching your search.
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
