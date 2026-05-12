"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { FileUp, Calendar, CheckCircle2, Clock, FileText, UploadCloud, X, MessageSquare, Search, Eye } from "lucide-react";

export default function StudentAssignmentsPage() {
  const [assignments] = useState([
    {
      id: 1,
      title: "React Components Build",
      course: "Fullstack Web Development",
      dueDate: "2026-10-25T23:59:59",
      status: "pending", 
      description: "Create a set of reusable UI components in React. Ensure all components are fully responsive and use tailwind classes for styling. Submit a zip file containing the components folder and a README.",
    },
    {
      id: 2,
      title: "UI/UX Case Study",
      course: "Advanced UI/UX",
      dueDate: "2026-10-10T23:59:59",
      status: "submitted",
      description: "Submit your final PDF case study for the redesign project. The case study should include wireframes, high-fidelity mockups, and user testing results.",
      submittedFile: "case-study-final.pdf",
      submittedDate: "2026-10-09T14:20:00",
    },
    {
      id: 3,
      title: "Python Data Analysis",
      course: "Python Bootcamp",
      dueDate: "2026-09-15T23:59:59",
      status: "graded",
      description: "Analyze the provided dataset using Pandas. Clean the data, perform exploratory data analysis, and plot at least 3 insightful charts.",
      submittedFile: "data_analysis.ipynb",
      submittedDate: "2026-09-14T09:15:00",
      grade: "95/100",
      feedback: "Excellent analysis and clean code. Great use of matplotlib for visualization. You could improve the narrative flow in the markdown cells.",
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "all" || a.course === courseFilter;
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            alert("File submitted successfully!");
            setActiveUploadId(null);
            setSelectedFile(null);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Graded</span>;
      case 'submitted':
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
              <option value="Fullstack Web Development">Fullstack Web Development</option>
              <option value="Advanced UI/UX">Advanced UI/UX</option>
              <option value="Python Bootcamp">Python Bootcamp</option>
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
                <th className="px-6 py-4 font-bold">Due Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[10px] font-bold text-[#FFBB0A] uppercase tracking-wider mb-0.5">{assignment.course}</div>
                    <div className="font-bold text-[#0F2942] text-base">{assignment.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600 font-medium">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(assignment.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(assignment.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dialog open={activeUploadId === assignment.id} onOpenChange={(open) => {
                      if (open) {
                        setActiveUploadId(assignment.id);
                        setSelectedFile(null);
                        setUploadProgress(0);
                      } else {
                        setActiveUploadId(null);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className={`font-bold ${
                            assignment.status === 'pending' ? 'bg-[#0F2942] hover:bg-[#0F2942]/90 text-[#FFBB0A]' : 
                            'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {assignment.status === 'pending' ? (
                            <><UploadCloud className="w-3.5 h-3.5 mr-1.5" /> Submit Work</>
                          ) : assignment.status === 'graded' ? (
                            <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> View Grade</>
                          ) : (
                            <><Eye className="w-3.5 h-3.5 mr-1.5" /> View Submission</>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] p-6 rounded-3xl bg-white">
                        <DialogHeader className="mb-4 border-b border-gray-100 pb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <DialogTitle className="text-xl font-extrabold text-[#0F2942]">
                                {assignment.status === 'pending' ? 'Submit Assignment' : assignment.status === 'graded' ? 'Grade Result' : 'Submission Details'}
                              </DialogTitle>
                              <p className="text-sm font-medium text-gray-500 mt-1">{assignment.course} - {assignment.title}</p>
                            </div>
                          </div>
                        </DialogHeader>

                        {/* Description Section */}
                        <div className="mb-6">
                          <h4 className="text-[10px] font-extrabold text-[#0F2942] mb-2 uppercase tracking-widest">Instructions</h4>
                          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{assignment.description}</p>
                        </div>

                        {/* Status Specific UI */}
                        {assignment.status === 'pending' && (
                          <div className="space-y-4">
                            {selectedFile ? (
                              <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                                  <div className="flex items-center text-sm font-bold text-[#0F2942] truncate mr-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 shrink-0">
                                      <FileText className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="truncate">{selectedFile.name}</span>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0">
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                
                                {uploadProgress > 0 ? (
                                  <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100">
                                    <div className="flex justify-between text-xs font-bold text-[#0F2942]">
                                      <span className="animate-pulse">Uploading securely...</span>
                                      <span className="text-blue-600">{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                  </div>
                                ) : (
                                  <Button onClick={simulateUpload} className="w-full bg-[#0F2942] hover:bg-[#0F2942]/90 text-[#FFBB0A] font-bold rounded-xl h-12 shadow-md hover:shadow-lg transition-all">
                                    Submit Assignment Now
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <label className="border-2 border-dashed border-gray-300 hover:border-[#FFBB0A] bg-white hover:bg-[#FFBB0A]/5 transition-all duration-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer group shadow-sm hover:shadow-md">
                                <div className="w-12 h-12 bg-gray-50 rounded-full shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:shadow-[#FFBB0A]/20 transition-all duration-300 shrink-0 mb-3">
                                  <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-[#FFBB0A]" />
                                </div>
                                <p className="text-sm font-extrabold text-[#0F2942]">Click to upload or drag & drop</p>
                                <p className="text-xs font-medium text-gray-400 mt-1">Supports PDF, DOCX, ZIP (Max 50MB)</p>
                                <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, assignment.id)} />
                              </label>
                            )}
                          </div>
                        )}

                        {assignment.status === 'submitted' && (
                          <div className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center shrink-0">
                                <FileUp className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-extrabold text-[#0F2942]">{assignment.submittedFile}</p>
                                <p className="text-xs font-medium text-gray-500 mt-0.5">Submitted on {new Date(assignment.submittedDate!).toLocaleString()}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">Under Review</span>
                          </div>
                        )}

                        {assignment.status === 'graded' && (
                          <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                              <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold text-[#0F2942] truncate">{assignment.submittedFile}</p>
                                <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">Submitted on {new Date(assignment.submittedDate!).toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-extrabold text-emerald-900 flex items-center uppercase tracking-widest">
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> Final Grade
                                </h4>
                                <div className="bg-white px-3 py-1 rounded-xl shadow-sm border border-emerald-200">
                                  <span className="text-lg font-black text-emerald-700">{assignment.grade}</span>
                                </div>
                              </div>
                              <div className="pt-3 border-t border-emerald-200/60">
                                <h4 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest mb-1.5 flex items-center opacity-80">
                                  <MessageSquare className="w-3 h-3 mr-1.5" /> Instructor Feedback
                                </h4>
                                <p className="text-sm text-emerald-900 font-medium leading-relaxed">{assignment.feedback}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              {filteredAssignments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium bg-gray-50/30">
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
