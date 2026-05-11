"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, PlayCircle, CheckCircle, FileText, CheckSquare, ClipboardList, Lock, ChevronDown, Check } from "lucide-react";
import VideoPlayer from "@/components/application/courses/video-player";
import coursesData from "@/resources/courses.json";
import Footer from "@/components/application/footer";
import GuestNavigation from "@/components/application/guest-navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CourseLearningPage({ params }: { params: { slug: string } }) {
  const course = coursesData.find((c) => c.slug === params.slug) || coursesData[0];
  
  // Flatten all lessons to allow next/previous navigation
  const allLessons = course.contents.flatMap((m, mIndex) => 
    (m.lessons || []).map((l, lIndex) => {
      const lesson = typeof l === 'string' ? { title: l, type: 'video' } : l;
      return {
        ...lesson,
        moduleIndex: mIndex,
        lessonIndex: lIndex,
        moduleTitle: m.title,
        globalIndex: 0 // Will set below
      };
    })
  );
  
  // Assign global indices
  allLessons.forEach((l, i) => { l.globalIndex = i; });

  const [activeGlobalIndex, setActiveGlobalIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [openSections, setOpenSections] = useState<number[]>([0]);

  // Load progress from local storage on mount
  useEffect(() => {
    const savedIndex = localStorage.getItem(`course_progress_${course.slug}`);
    if (savedIndex !== null) {
      setActiveGlobalIndex(parseInt(savedIndex, 10));
    }
    const savedCompleted = localStorage.getItem(`course_completed_${course.slug}`);
    if (savedCompleted) {
      try {
        setCompletedLessons(JSON.parse(savedCompleted));
      } catch (e) {}
    }
  }, [course.slug]);

  const activeLesson = allLessons[activeGlobalIndex] || allLessons[0];
  
  // Make sure the active section is open when navigating
  useEffect(() => {
    if (activeLesson) {
      setOpenSections(prev => 
        prev.includes(activeLesson.moduleIndex) ? prev : [...prev, activeLesson.moduleIndex]
      );
    }
  }, [activeGlobalIndex, activeLesson?.moduleIndex]);

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSetLesson = (idx: number) => {
    setActiveGlobalIndex(idx);
    localStorage.setItem(`course_progress_${course.slug}`, idx.toString());
  };

  const markCurrentAsCompleted = () => {
    const newCompleted = Array.from(new Set([...completedLessons, activeGlobalIndex]));
    setCompletedLessons(newCompleted);
    localStorage.setItem(`course_completed_${course.slug}`, JSON.stringify(newCompleted));
  };

  const handleNextLesson = () => {
    markCurrentAsCompleted();
    if (activeGlobalIndex < allLessons.length - 1) {
      handleSetLesson(activeGlobalIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (activeGlobalIndex > 0) {
      handleSetLesson(activeGlobalIndex - 1);
    }
  };

  const renderContent = () => {
    const type = activeLesson.type || 'video';
    
    if (type === 'video') {
      return (
        <div className="flex-1 w-full h-full bg-black flex flex-col relative">
          <VideoPlayer 
            key={activeLesson.globalIndex} // Force remount on lesson change
            src={activeLesson.url || "https://files.vidstack.io/sprite-fight/720p.mp4"} 
            title={activeLesson.title}
            courseId={course.slug}
            lessonId={`lesson-${activeLesson.globalIndex}`}
            onEnded={handleNextLesson}
          />
        </div>
      );
    }
    
    if (type === 'quiz') {
      return (
        <div className="flex-1 w-full h-full bg-white overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-background-darkYellow mb-6">
              <CheckSquare className="w-8 h-8" />
              <h2 className="text-3xl font-extrabold text-gray-900">{activeLesson.title}</h2>
            </div>
            
            {activeLesson.description && (
              <div 
                className="prose prose-lg max-w-none text-gray-600 mb-10"
                dangerouslySetInnerHTML={{ __html: activeLesson.description }}
              />
            )}
            
            {activeLesson.questions && (
              <div className="space-y-8">
                {activeLesson.questions.map((q: any, qIndex: number) => (
                  <div key={qIndex} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-gray-900 text-lg mb-4">{qIndex + 1}. {q.question}</h4>
                    <div className="space-y-3">
                      {q.options.map((opt: string, oIndex: number) => (
                        <label key={oIndex} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-background-darkYellow cursor-pointer transition-colors group">
                          <input type="radio" name={`quiz-${activeLesson.globalIndex}-q-${qIndex}`} className="w-5 h-5 text-background-darkYellow focus:ring-background-darkYellow border-gray-300" />
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
            )}
          </div>
        </div>
      );
    }

    if (type === 'assignment') {
      return (
        <div className="flex-1 w-full h-full bg-white overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-blue-600 mb-6">
              <ClipboardList className="w-8 h-8" />
              <h2 className="text-3xl font-extrabold text-gray-900">{activeLesson.title}</h2>
            </div>
            
            {activeLesson.description && (
              <div 
                className="prose prose-lg max-w-none text-gray-600 mb-10"
                dangerouslySetInnerHTML={{ __html: activeLesson.description }}
              />
            )}
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center mt-10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Your Assignment</h3>
              <p className="text-gray-600 mb-6">Upload your project files or paste your repository link below.</p>
              
              <div className="max-w-md mx-auto space-y-4">
                <button className="w-full h-14 bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl font-medium text-gray-600 transition-colors">
                  + Attach Files
                </button>
                <input type="text" placeholder="https://github.com/your-repo" className="w-full h-14 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="mt-8">
                <Button onClick={handleNextLesson} className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 text-base rounded-xl font-bold">
                  Submit & Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Article type (default fallback)
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
            <Button onClick={handlePreviousLesson} disabled={activeGlobalIndex === 0} variant="outline" className="h-12 px-6 rounded-xl font-bold border-gray-300">
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
      {/* App Bar */}
      <GuestNavigation />

      {/* Main Content Area */}
      <div className="max-w-[1800px] mx-auto w-full flex-1 flex flex-col p-4 md:p-6 lg:p-8">
        
        {/* Course Header */}
        <div className="flex items-center justify-between gap-6 mb-6 md:mb-8 mt-2 px-2">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => window.history.length > 2 ? window.history.back() : window.location.href = '/student/my-courses'}
              className="w-12 h-12 shrink-0 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                {course.name || course.courseName}
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Student Learning Dashboard</p>
            </div>
          </div>
          
          {/* Progress Ring */}
          <div className="hidden sm:flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-2xl shadow-sm">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#FFBB0A]"
                  strokeDasharray={`${Math.min(100, (completedLessons.length / allLessons.length) * 100)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-900">
                {Math.round((completedLessons.length / allLessons.length) * 100)}%
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900">Your Progress</span>
              <span className="text-[10px] font-medium text-gray-500">{completedLessons.length} of {allLessons.length} complete</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-white min-h-[75vh]">
          
          {/* Left Side: Dynamic Content Area (70%) */}
          <div className="w-full lg:w-[70%] h-[50vh] lg:h-full bg-gray-50 flex flex-col relative overflow-hidden">
            {renderContent()}
            
            {/* Below Video Description (Visible on Desktop only for Videos) */}
            {(activeLesson.type === 'video' || !activeLesson.type) && (
              <div className="hidden lg:block h-[30%] shrink-0 bg-white border-t border-gray-200 p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h2>
                  <Button onClick={handleNextLesson} variant="outline" className="font-bold border-gray-300">Next Lesson</Button>
                </div>
                <p className="text-gray-600 mb-6">Section {activeLesson.moduleIndex + 1} • Lecture {activeLesson.lessonIndex + 1}</p>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3">About this lecture</h3>
                <p className="text-gray-700 leading-relaxed max-w-4xl">
                  {activeLesson.description ? (
                    <span dangerouslySetInnerHTML={{ __html: activeLesson.description }} />
                  ) : (
                    "Welcome to this lecture! Pay close attention to the concepts covered in this video. If you have any questions, feel free to use the Q&A section."
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Right Side: Sidebar Tabs (30%) */}
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
                  {course.contents.map((module: any, mIndex: number) => {
                    const isOpen = openSections.includes(mIndex);
                    
                    // Calculate how many lessons in this specific module are completed
                    const completedInModule = (module.lessons || []).filter((_: any, lIndex: number) => {
                      const globalIdx = allLessons.find(al => al.moduleIndex === mIndex && al.lessonIndex === lIndex)?.globalIndex || 0;
                      return completedLessons.includes(globalIdx);
                    }).length;
                    
                    const totalInModule = module.lessons?.length || 0;
                    const isModuleFullyCompleted = totalInModule > 0 && completedInModule === totalInModule;

                    return (
                      <div key={mIndex} className="border-b border-gray-200">
                        <div 
                          onClick={() => toggleSection(mIndex)}
                          className="p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-bold text-[15px] ${isModuleFullyCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                                Section {mIndex + 1}: {module.title}
                              </h3>
                              {isModuleFullyCompleted && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {completedInModule} / {totalInModule} completed | {module.totalVideoLength || "45min"}
                            </p>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {isOpen && (
                          <div className="flex flex-col bg-white">
                            {module.lessons?.map((l: any, lIndex: number) => {
                              const lesson = typeof l === 'string' ? { title: l, type: 'video' } : l;
                              const lessonType = lesson.type || 'video';
                              
                              // Find its global index
                              const globalIdx = allLessons.find(al => al.moduleIndex === mIndex && al.lessonIndex === lIndex)?.globalIndex || 0;
                              const isActive = globalIdx === activeGlobalIndex;
                              const isCompleted = completedLessons.includes(globalIdx);
                              
                              const Icon = lessonType === 'article' ? FileText : 
                                          lessonType === 'quiz' ? CheckSquare : 
                                          lessonType === 'assignment' ? ClipboardList : 
                                          PlayCircle;

                              return (
                                <div 
                                  key={lIndex} 
                                  onClick={() => handleSetLesson(globalIdx)}
                                  className={`flex gap-3 p-4 transition-colors cursor-pointer border-b border-gray-100 last:border-0 ${
                                    isActive ? 'bg-background-darkYellow/5 border-l-4 border-l-background-darkYellow' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                                  }`}
                                >
                                  <div className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5">
                                    {isCompleted ? (
                                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                    ) : (
                                      <input type="checkbox" checked={isActive} readOnly className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                                    )}
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    <span className={`text-[14px] leading-snug ${isActive ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                      {lIndex + 1}. {lesson.title}
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-background-darkYellow' : 'text-gray-500'}`} />
                                      <span className="text-xs text-gray-500">{lesson.duration || "08:15"}</span>
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
                      className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0F2942]"
                      placeholder="Take a note..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg bg-gray-50 hover:bg-gray-100">
                        @ 04:20
                      </Button>
                      <Button size="sm" className="h-8 text-xs font-bold bg-[#0F2942] text-white rounded-lg">
                        Save Note
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex-1">
                    <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-[#FFBB0A] bg-[#FFBB0A]/10 px-2 py-0.5 rounded-md">@ 01:15</span>
                        <span className="text-[10px] text-gray-400">Oct 12</span>
                      </div>
                      <p className="text-sm text-gray-700">Need to remember to use useEffect when saving to localStorage.</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full font-bold border-gray-200 hover:bg-gray-50 text-[#0F2942]">
                    Download PDF
                  </Button>
                </TabsContent>

                <TabsContent value="qa" className="m-0 p-5 h-full border-0 outline-none flex flex-col space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Ask a Question</h3>
                    <input 
                      type="text"
                      className="w-full h-10 px-3 border border-gray-200 rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-[#0F2942] text-sm"
                      placeholder="Question title..."
                    />
                    <textarea 
                      className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0F2942] text-sm"
                      placeholder="Describe what you are stuck on..."
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" className="h-8 text-xs font-bold bg-[#0F2942] text-white rounded-lg">
                        Post Question
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex-1">
                    <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center shrink-0">
                          <button className="text-gray-400 hover:text-[#0F2942]">▲</button>
                          <span className="font-bold text-sm">12</span>
                          <button className="text-gray-400 hover:text-[#0F2942]">▼</button>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">Why is my progress not saving?</h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">I have completed the video but it still shows as incomplete in the sidebar.</p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <span className="font-semibold text-gray-600">Alex</span> • <span>2 days ago</span> • <span className="font-semibold text-[#0BA4DB]">1 Answer</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
