"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Search, CheckCircle2, MessageSquare, Edit3, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function TrainerAssignmentsPage() {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      studentName: "John Doe",
      assignmentTitle: "React Components Build",
      course: "Fullstack Web Development",
      submittedDate: "2026-10-24T14:30:00",
      fileUrl: "#",
      fileName: "react_components_john.zip",
      status: "needs_grading", // needs_grading, graded
      grade: "",
      feedback: "",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      assignmentTitle: "UI/UX Case Study",
      course: "Advanced UI/UX",
      submittedDate: "2026-10-09T16:45:00",
      fileUrl: "#",
      fileName: "case-study-jane.pdf",
      status: "graded",
      grade: "92/100",
      feedback: "Great work on the user research section.",
    },
    {
      id: 3,
      studentName: "Alex Johnson",
      assignmentTitle: "Python Data Analysis",
      course: "Python Bootcamp",
      submittedDate: "2026-09-14T11:20:00",
      fileUrl: "#",
      fileName: "analysis_alex.ipynb",
      status: "graded",
      grade: "88/100",
      feedback: "Good analysis, but needs more detailed visualizations.",
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeGradingId, setActiveGradingId] = useState<number | null>(null);
  const [tempGrade, setTempGrade] = useState("");
  const [tempFeedback, setTempFeedback] = useState("");

  const filteredSubmissions = submissions.filter(sub => 
    sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGradeSubmit = () => {
    setSubmissions(submissions.map(sub => {
      if (sub.id === activeGradingId) {
        return {
          ...sub,
          status: "graded",
          grade: tempGrade,
          feedback: tempFeedback
        };
      }
      return sub;
    }));
    setActiveGradingId(null);
    setTempGrade("");
    setTempFeedback("");
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
          <div className="flex gap-2">
            <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none">
              <option value="all">All Courses</option>
              <option value="fullstack">Fullstack Web Development</option>
              <option value="uiux">Advanced UI/UX</option>
            </select>
            <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-background-darkYellow focus:border-background-darkYellow outline-none">
              <option value="all">All Status</option>
              <option value="needs_grading">Needs Grading</option>
              <option value="graded">Graded</option>
            </select>
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
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{submission.studentName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{new Date(submission.submittedDate).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[10px] font-bold text-background-darkYellow uppercase tracking-wider mb-0.5">{submission.course}</div>
                    <div className="font-bold text-gray-900">{submission.assignmentTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-gray-200 text-gray-700 bg-white hover:bg-gray-50">
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      {submission.fileName}
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    {submission.status === 'graded' ? (
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
                        <Button size="sm" className={`font-bold ${submission.status === 'graded' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-background-darkYellow text-white hover:bg-yellow-600'}`}>
                          <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                          {submission.status === 'graded' ? 'Edit Grade' : 'Grade'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] p-6 rounded-3xl bg-white">
                        <DialogHeader className="mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <DialogTitle className="text-xl font-extrabold text-gray-900">Grade Submission</DialogTitle>
                              <p className="text-sm font-medium text-gray-500 mt-1">{submission.studentName} - {submission.assignmentTitle}</p>
                            </div>
                            <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-gray-200">
                              <Download className="w-3.5 h-3.5 mr-1.5" /> Download Work
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
                            disabled={!tempGrade}
                          >
                            Submit Grade
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              {filteredSubmissions.length === 0 && (
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
