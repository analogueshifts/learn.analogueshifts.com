"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, PlayCircle, CheckCircle, FileText, CheckSquare, ClipboardList, Lock, ChevronDown, Check } from "lucide-react";
import VideoPlayer from "@/components/application/courses/video-player";
import coursesData from "@/resources/courses.json";
import Footer from "@/components/application/footer";
import GuestNavigation from "@/components/application/guest-navigation";
import { Button } from "@/components/ui/button";

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
        <div className="flex items-center gap-6 mb-6 md:mb-8 mt-2 px-2">
          <Link 
            href={`/courses/${course.slug}`} 
            className="w-12 h-12 shrink-0 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {course.name || course.courseName}
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Student Learning Dashboard</p>
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

          {/* Right Side: Curriculum Sidebar (30%) */}
          <div className="w-full lg:w-[30%] bg-white border-l border-gray-200 h-[60vh] lg:h-full flex flex-col shrink-0 overflow-hidden">
            <div className="p-5 border-b border-gray-200 bg-white shadow-sm z-10 shrink-0">
              <h2 className="font-bold text-gray-900">Course Content</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto pb-10">
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
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
