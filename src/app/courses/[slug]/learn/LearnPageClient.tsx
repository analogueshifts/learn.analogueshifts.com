"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, PlayCircle, CheckCircle, FileText, CheckSquare, ClipboardList, ChevronDown, Check, Loader2, ArrowBigUp } from "lucide-react";
import VideoPlayer from "@/components/application/courses/video-player";
import Footer from "@/components/application/footer";
import GuestNavigation from "@/components/application/guest-navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface Lesson {
  id: string;
  title: string;
  type: "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT";
  videoUrl: string | null;
  duration: string | null;
  description: string | null;
  isFreePreview: boolean;
  order: number;
  quiz: { id: string; passScore: number; questions: QuizQuestion[] } | null;
  assignment: { id: string; title: string; description: string | null } | null;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  slug: string;
  title: string;
  sections: Section[];
}

interface Note {
  id: string;
  timestamp: number;
  content: string;
  createdAt: string;
  lessonId: string;
}

interface Answer {
  id: string;
  body: string;
  isAccepted: boolean;
  upvotes: number;
  author: { name: string };
}

interface Question {
  id: string;
  title: string;
  body: string;
  upvotes: number;
  createdAt: string;
  author: { name: string };
  answers: Answer[];
}

interface FlatLesson extends Lesson {
  sectionIndex: number;
  sectionTitle: string;
  globalIndex: number;
}

export default function LearnPageClient({
  course,
  completedLessonIds,
  currentLessonId,
}: {
  course: Course;
  completedLessonIds: string[];
  currentLessonId: string | null;
}) {
  const allLessons: FlatLesson[] = useMemo(
    () =>
      course.sections.flatMap((section, sectionIndex) =>
        section.lessons.map((lesson) => ({
          ...lesson,
          sectionIndex,
          sectionTitle: section.title,
          globalIndex: 0,
        }))
      ).map((lesson, i) => ({ ...lesson, globalIndex: i })),
    [course]
  );

  const initialIndex = Math.max(0, allLessons.findIndex((l) => l.id === currentLessonId));
  const [activeIndex, setActiveIndex] = useState(initialIndex === -1 ? 0 : initialIndex);
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedLessonIds));
  const [openSections, setOpenSections] = useState<number[]>([allLessons[initialIndex]?.sectionIndex ?? 0]);

  const activeLesson = allLessons[activeIndex] ?? allLessons[0];

  useEffect(() => {
    if (activeLesson) {
      setOpenSections((prev) =>
        prev.includes(activeLesson.sectionIndex) ? prev : [...prev, activeLesson.sectionIndex]
      );
    }
  }, [activeLesson?.sectionIndex]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  async function syncProgress(lessonId: string, watchTime: number, isCompleted: boolean) {
    await fetch("/api/learn/watchtime", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id, lessonId, watchTime, completed: isCompleted }),
    });
    if (isCompleted) setCompleted((prev) => new Set(prev).add(lessonId));
  }

  const handleSetLesson = (idx: number) => setActiveIndex(idx);

  const handleNextLesson = async () => {
    await syncProgress(activeLesson.id, 0, true);
    if (activeIndex < allLessons.length - 1) handleSetLesson(activeIndex + 1);
  };

  const handlePreviousLesson = () => {
    if (activeIndex > 0) handleSetLesson(activeIndex - 1);
  };

  const progressPercent = allLessons.length > 0 ? Math.round((completed.size / allLessons.length) * 100) : 0;

  // === Notes ===
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteDraft, setNoteDraft] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    setNotesLoading(true);
    fetch(`/api/notes?courseId=${course.id}`)
      .then((res) => res.json())
      .then((body) => body.success && setNotes(body.data))
      .finally(() => setNotesLoading(false));
  }, [course.id]);

  const lessonNotes = notes.filter((n) => n.lessonId === activeLesson.id);

  const handleSaveNote = async () => {
    if (!noteDraft.trim()) return;
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: activeLesson.id, content: noteDraft, timestamp: 0 }),
    });
    const body = await response.json();
    if (body.success) {
      setNotes((prev) => [body.data, ...prev]);
      setNoteDraft("");
      toast.success("Note saved");
    }
  };

  const handleExportNotes = () => {
    window.open(`/api/notes/export?courseId=${course.id}`, "_blank");
  };

  // === Q&A ===
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qaLoading, setQaLoading] = useState(false);
  const [qTitle, setQTitle] = useState("");
  const [qBody, setQBody] = useState("");

  useEffect(() => {
    setQaLoading(true);
    fetch(`/api/qa/questions?lessonId=${activeLesson.id}`)
      .then((res) => res.json())
      .then((body) => body.success && setQuestions(body.data))
      .finally(() => setQaLoading(false));
  }, [activeLesson.id]);

  const handlePostQuestion = async () => {
    if (!qTitle.trim() || !qBody.trim()) return;
    const response = await fetch("/api/qa/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: activeLesson.id, title: qTitle, body: qBody }),
    });
    const body = await response.json();
    if (body.success) {
      setQuestions((prev) => [{ ...body.data, author: { name: "You" }, answers: [] }, ...prev]);
      setQTitle("");
      setQBody("");
      toast.success("Question posted");
    }
  };

  const handleUpvoteQuestion = async (id: string) => {
    await fetch(`/api/qa/questions/${id}/upvote`, { method: "POST" });
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q)));
  };

  // === Assignment submission ===
  const [assignmentUrl, setAssignmentUrl] = useState("");
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  const handleSubmitAssignment = async () => {
    if (!activeLesson.assignment || !assignmentUrl.trim()) return;
    setSubmittingAssignment(true);
    const response = await fetch(`/api/assignments/${activeLesson.assignment.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl: assignmentUrl }),
    });
    const body = await response.json();
    setSubmittingAssignment(false);
    if (body.success) {
      toast.success("Assignment submitted!");
      handleNextLesson();
    } else {
      toast.error(body.error ?? "Failed to submit assignment");
    }
  };

  const renderContent = () => {
    const type = activeLesson.type;

    if (type === "VIDEO") {
      return (
        <div className="flex-1 w-full h-full bg-black flex flex-col relative">
          <VideoPlayer
            key={activeLesson.id}
            src={activeLesson.videoUrl || "https://files.vidstack.io/sprite-fight/720p.mp4"}
            title={activeLesson.title}
            courseId={course.id}
            lessonId={activeLesson.id}
            onEnded={handleNextLesson}
          />
        </div>
      );
    }

    if (type === "QUIZ") {
      return (
        <div className="flex-1 w-full h-full bg-white overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-background-darkYellow mb-6">
              <CheckSquare className="w-8 h-8" />
              <h2 className="text-3xl font-extrabold text-gray-900">{activeLesson.title}</h2>
            </div>

            {activeLesson.quiz?.questions && activeLesson.quiz.questions.length > 0 ? (
              <div className="space-y-8">
                {activeLesson.quiz.questions.map((q, qIndex) => (
                  <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-gray-900 text-lg mb-4">{qIndex + 1}. {q.question}</h4>
                    <div className="space-y-3">
                      {q.options.map((opt, oIndex) => (
                        <label key={oIndex} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-background-darkYellow cursor-pointer transition-colors group">
                          <input type="radio" name={`quiz-${q.id}`} className="w-5 h-5 text-background-darkYellow focus:ring-background-darkYellow border-gray-300" />
                          <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-6 flex justify-end">
                  <Button onClick={handleNextLesson} className="bg-gray-900 text-white hover:bg-gray-800 h-14 px-8 text-lg rounded-xl font-bold">
                    Submit Quiz & Continue
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">This quiz has no questions yet.</p>
            )}
          </div>
        </div>
      );
    }

    if (type === "ASSIGNMENT") {
      return (
        <div className="flex-1 w-full h-full bg-white overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-blue-600 mb-6">
              <ClipboardList className="w-8 h-8" />
              <h2 className="text-3xl font-extrabold text-gray-900">{activeLesson.title}</h2>
            </div>

            {activeLesson.assignment?.description && (
              <p className="text-gray-600 mb-10">{activeLesson.assignment.description}</p>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center mt-10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Your Assignment</h3>
              <p className="text-gray-600 mb-6">Paste a link to your file or repository below.</p>

              <div className="max-w-md mx-auto space-y-4">
                <input
                  type="text"
                  value={assignmentUrl}
                  onChange={(e) => setAssignmentUrl(e.target.value)}
                  placeholder="https://github.com/your-repo"
                  className="w-full h-14 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleSubmitAssignment}
                  disabled={submittingAssignment || !assignmentUrl.trim()}
                  className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 text-base rounded-xl font-bold"
                >
                  {submittingAssignment ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit & Complete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 w-full h-full bg-white overflow-y-auto p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 text-gray-400 mb-6">
            <FileText className="w-8 h-8" />
            <h2 className="text-3xl font-extrabold text-gray-900">{activeLesson.title}</h2>
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: activeLesson.description || "<p>This is a text-based lesson.</p>" }}
          />

          <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
            <Button onClick={handlePreviousLesson} disabled={activeIndex === 0} variant="outline" className="h-12 px-6 rounded-xl font-bold border-gray-300">
              Previous
            </Button>
            <Button onClick={handleNextLesson} className="bg-gray-900 text-white hover:bg-gray-800 h-12 px-8 rounded-xl font-bold">
              Mark as Complete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-20 lg:pt-24">
      <GuestNavigation />

      <div className="max-w-[1800px] mx-auto w-full flex-1 flex flex-col p-4 md:p-6 lg:p-8">

        <div className="flex items-center justify-between gap-6 mb-6 md:mb-8 mt-2 px-2">
          <div className="flex items-center gap-6">
            <button
              onClick={() => (window.history.length > 2 ? window.history.back() : (window.location.href = "/student/my-courses"))}
              className="w-12 h-12 shrink-0 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{course.title}</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Student Learning Dashboard</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-2xl shadow-sm">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                <path className="text-[#FFBB0A]" strokeDasharray={`${progressPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-900">{progressPercent}%</div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900">Your Progress</span>
              <span className="text-[10px] font-medium text-gray-500">{completed.size} of {allLessons.length} complete</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-white min-h-[75vh]">

          <div className="w-full lg:w-[70%] h-[50vh] lg:h-full bg-gray-50 flex flex-col relative overflow-hidden">
            {renderContent()}

            {activeLesson.type === "VIDEO" && (
              <div className="hidden lg:block h-[30%] shrink-0 bg-white border-t border-gray-200 p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h2>
                  <Button onClick={handleNextLesson} variant="outline" className="font-bold border-gray-300">Next Lesson</Button>
                </div>
                <p className="text-gray-600 mb-6">{activeLesson.sectionTitle}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-3">About this lecture</h3>
                <p className="text-gray-700 leading-relaxed max-w-4xl">
                  {activeLesson.description || "Welcome to this lecture! Pay close attention to the concepts covered in this video. If you have any questions, feel free to use the Q&A section."}
                </p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[30%] bg-white border-l border-gray-200 h-[60vh] lg:h-full flex flex-col shrink-0 overflow-hidden">
            <Tabs defaultValue="curriculum" className="w-full h-full flex flex-col">
              <div className="p-3 border-b border-gray-200 bg-white shadow-sm z-10 shrink-0">
                <TabsList className="w-full grid grid-cols-3 bg-muted/50 p-1 rounded-xl h-auto">
                  <TabsTrigger value="curriculum" className="text-xs font-semibold py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0F2942] data-[state=active]:shadow-sm">Curriculum</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs font-semibold py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0F2942] data-[state=active]:shadow-sm">Notes</TabsTrigger>
                  <TabsTrigger value="qa" className="text-xs font-semibold py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0F2942] data-[state=active]:shadow-sm">Q&A</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto relative bg-gray-50/30">
                <TabsContent value="curriculum" className="m-0 h-full border-0 outline-none pb-10">
                  {course.sections.map((section, sIndex) => {
                    const isOpen = openSections.includes(sIndex);
                    const completedInSection = section.lessons.filter((l) => completed.has(l.id)).length;
                    const isSectionDone = section.lessons.length > 0 && completedInSection === section.lessons.length;

                    return (
                      <div key={section.id} className="border-b border-gray-200">
                        <div onClick={() => toggleSection(sIndex)} className="p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-bold text-[15px] ${isSectionDone ? "text-green-700" : "text-gray-900"}`}>Section {sIndex + 1}: {section.title}</h3>
                              {isSectionDone && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{completedInSection} / {section.lessons.length} completed</p>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </div>

                        {isOpen && (
                          <div className="flex flex-col bg-white">
                            {section.lessons.map((lesson) => {
                              const globalIdx = allLessons.findIndex((l) => l.id === lesson.id);
                              const isActive = lesson.id === activeLesson.id;
                              const isCompleted = completed.has(lesson.id);
                              const Icon = lesson.type === "ARTICLE" ? FileText : lesson.type === "QUIZ" ? CheckSquare : lesson.type === "ASSIGNMENT" ? ClipboardList : PlayCircle;

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => handleSetLesson(globalIdx)}
                                  className={`flex gap-3 p-4 transition-colors cursor-pointer border-b border-gray-100 last:border-0 ${isActive ? "bg-background-darkYellow/5 border-l-4 border-l-background-darkYellow" : "hover:bg-gray-50 border-l-4 border-l-transparent"}`}
                                >
                                  <div className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5">
                                    {isCompleted ? (
                                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    ) : (
                                      <input type="checkbox" checked={isActive} readOnly className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                                    )}
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    <span className={`text-[14px] leading-snug ${isActive ? "font-bold text-gray-900" : "text-gray-700"}`}>{lesson.title}</span>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-background-darkYellow" : "text-gray-500"}`} />
                                      <span className="text-xs text-gray-500">{lesson.duration || "—"}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </TabsContent>

                <TabsContent value="notes" className="m-0 p-5 h-full border-0 outline-none flex flex-col space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">My Notes</h3>
                    <textarea
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0F2942]"
                      placeholder="Take a note..."
                    />
                    <div className="flex justify-end items-center mt-2">
                      <Button size="sm" onClick={handleSaveNote} disabled={!noteDraft.trim()} className="h-8 text-xs font-bold bg-[#0F2942] text-white rounded-lg">
                        Save Note
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex-1">
                    {notesLoading ? (
                      <p className="text-sm text-gray-400">Loading notes...</p>
                    ) : lessonNotes.length === 0 ? (
                      <p className="text-sm text-gray-400">No notes yet for this lesson.</p>
                    ) : (
                      lessonNotes.map((note) => (
                        <div key={note.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm mb-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] text-gray-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <Button variant="outline" onClick={handleExportNotes} className="w-full font-bold border-gray-200 hover:bg-gray-50 text-[#0F2942]">
                    Download PDF
                  </Button>
                </TabsContent>

                <TabsContent value="qa" className="m-0 p-5 h-full border-0 outline-none flex flex-col space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Ask a Question</h3>
                    <input
                      type="text"
                      value={qTitle}
                      onChange={(e) => setQTitle(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-200 rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-[#0F2942] text-sm"
                      placeholder="Question title..."
                    />
                    <textarea
                      value={qBody}
                      onChange={(e) => setQBody(e.target.value)}
                      className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0F2942] text-sm"
                      placeholder="Describe what you are stuck on..."
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={handlePostQuestion} disabled={!qTitle.trim() || !qBody.trim()} className="h-8 text-xs font-bold bg-[#0F2942] text-white rounded-lg">
                        Post Question
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex-1">
                    {qaLoading ? (
                      <p className="text-sm text-gray-400">Loading questions...</p>
                    ) : questions.length === 0 ? (
                      <p className="text-sm text-gray-400">No questions yet for this lesson.</p>
                    ) : (
                      questions.map((q) => (
                        <div key={q.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm mb-3">
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center shrink-0">
                              <button onClick={() => handleUpvoteQuestion(q.id)} className="text-gray-400 hover:text-[#0F2942]">
                                <ArrowBigUp className="w-4 h-4" />
                              </button>
                              <span className="font-bold text-sm">{q.upvotes}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{q.title}</h4>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{q.body}</p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <span className="font-semibold text-gray-600">{q.author.name}</span> • <span className="font-semibold text-[#0BA4DB]">{q.answers.length} Answer{q.answers.length === 1 ? "" : "s"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
