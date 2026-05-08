"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlayCircle, Lock, Video, FileText, CheckSquare, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

interface LessonObj {
  title: string;
  type?: 'video' | 'article' | 'quiz' | 'assignment';
  duration?: string;
  description?: string;
}

interface Module {
  id?: string;
  title: string;
  totalVideo?: number;
  totalVideoLength?: string;
  lessons?: (string | LessonObj)[];
}

const LessonItem = ({ lesson, index, moduleIndex, isPreview, isEnrolled, onPreviewClick }: { lesson: any, index: number, moduleIndex: number, isPreview: boolean, isEnrolled?: boolean, onPreviewClick?: (lesson: any) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lessonType = lesson.type || 'video';
  const duration = lesson.duration || `${10 + (index * 2)}:${String(15 + (index * 7)).padStart(2, '0')}`;
  
  const Icon = lessonType === 'article' ? FileText : 
               lessonType === 'quiz' ? CheckSquare : 
               lessonType === 'assignment' ? ClipboardList : 
               PlayCircle;

  const hasContent = !!lesson.description || (lessonType === 'video' && isPreview);
  const isAccessible = isPreview || isEnrolled;

  return (
    <div className="flex flex-col border-b border-gray-100 last:border-0 group/lesson">
      <div 
        onClick={() => { 
          if (!isAccessible) return;
          if (lessonType === 'video' && isPreview && onPreviewClick) {
            onPreviewClick(lesson);
          } else if (hasContent) {
            setIsExpanded(!isExpanded);
          }
        }}
        className={`flex items-center justify-between px-6 py-3 transition-colors ${isAccessible ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      >
        <div className="flex items-start gap-4">
          <div className="pt-0.5 relative">
            <Icon className={`w-4 h-4 transition-transform ${isAccessible ? 'text-background-darkYellow group-hover/lesson:scale-110' : 'text-gray-400'}`} />
          </div>
          <div className="flex flex-col">
            <span 
              className={`text-sm ${
                isAccessible 
                  ? 'text-background-darkYellow font-medium underline-offset-4 group-hover/lesson:underline' 
                  : 'text-gray-700'
              }`}
            >
              {index + 1}. {lesson.title}
            </span>
            <div className="flex items-center gap-1.5 mt-1 sm:hidden">
              <Icon className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 capitalize">{lessonType} • {duration}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0 pl-4 hidden sm:flex">
          {!isAccessible && (
            <Lock className="w-3.5 h-3.5 text-gray-400 mr-2" />
          )}
          {isPreview && !hasContent && (
            <span className="text-sm font-medium text-background-darkYellow underline-offset-4 hover:underline">
              Preview
            </span>
          )}
          {hasContent && isAccessible && (
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          )}
          <span className="text-sm text-gray-500 font-medium w-12 text-right">
            {duration}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && hasContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50/50"
          >
            <div className="px-14 py-6 text-gray-700">
              {lesson.description && (
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: lesson.description }}
                />
              )}
              
              {lessonType === 'quiz' && lesson.questions && (
                <div className="mt-8 space-y-6">
                  {lesson.questions.map((q: any, qIndex: number) => (
                    <div key={qIndex} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-4">{qIndex + 1}. {q.question}</h4>
                      <div className="space-y-2.5">
                        {q.options.map((opt: string, oIndex: number) => (
                          <label key={oIndex} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                            <input type="radio" name={`quiz-${index}-q-${qIndex}`} className="w-4 h-4 text-background-darkYellow focus:ring-background-darkYellow border-gray-300" />
                            <span className="text-sm font-medium text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button className="w-full font-bold bg-gray-900 text-white hover:bg-gray-800 h-12 rounded-xl">
                    Submit Answers
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CurriculumAccordionProps {
  contents: Module[];
}

export default function CurriculumAccordion({ contents, isEnrolled = false }: CurriculumAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const router = useRouter();
  const pathname = usePathname();

  const handlePreviewClick = () => {
    // Navigate to the dedicated learning screen
    router.push(`${pathname}/learn`);
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!contents || contents.length === 0) {
    return (
      <div className="w-full p-10 border-2 border-gray-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-center bg-gray-50/50">
        <div className="w-14 h-14 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
        <h4 className="font-bold text-lg text-primary-tan mb-2">Curriculum in development</h4>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          The modules and video lessons for this course are currently being structured and finalized by the instructor.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
      {contents.map((module, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={module.id || `mod-${index}`} className="border-b border-gray-200 last:border-0 bg-white">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between px-6 py-4 transition-colors focus:outline-none hover:bg-gray-50/50 group"
            >
              <div className="flex flex-col text-left">
                <span className={`font-bold text-base transition-colors ${isOpen ? "text-background-darkYellow" : "text-primary-tan group-hover:text-background-darkYellow"}`}>
                  Section {index + 1}: {module.title}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {module.lessons?.length || 0} lectures • {module.totalVideoLength || "45min"}
                </span>
              </div>
              
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`w-9 h-9 flex items-center justify-center rounded-full shadow-sm border transition-colors ${
                  isOpen 
                    ? "bg-background-darkYellow text-white border-background-darkYellow" 
                    : "bg-white text-gray-400 border-gray-200 group-hover:border-background-darkYellow group-hover:text-background-darkYellow"
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden bg-white border-t border-gray-100"
                >
                  <div className="flex flex-col py-1">
                    {module.lessons?.map((lessonItem, i) => {
                      const isPreview = i === 0 && index === 0;
                      // Support both string legacy format and new object format
                      const lesson = typeof lessonItem === 'string' ? { title: lessonItem, type: 'video' } : lessonItem;
                      
                      return (
                        <LessonItem 
                          key={i} 
                          lesson={lesson} 
                          index={i} 
                          moduleIndex={index}
                          isPreview={isPreview} 
                          isEnrolled={isEnrolled}
                          onPreviewClick={handlePreviewClick}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
