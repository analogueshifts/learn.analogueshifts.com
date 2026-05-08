"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlayCircle, Lock } from "lucide-react";

interface Module {
  id?: string;
  title: string;
  totalVideo?: number;
  totalVideoLength?: string;
  lessons?: string[];
}

interface CurriculumAccordionProps {
  contents: Module[];
}

export default function CurriculumAccordion({ contents }: CurriculumAccordionProps) {
  // Open the first module by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                    {module.lessons?.map((lesson, i) => {
                      const isPreview = i === 0 && index === 0;
                      // Generate a stable fake duration based on the lesson index
                      const fakeDuration = `${10 + (i * 2)}:${String(15 + (i * 7)).padStart(2, '0')}`;
                      
                      return (
                        <div 
                          key={i} 
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group/lesson cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            <div className="pt-0.5">
                              {isPreview ? (
                                <PlayCircle className="w-4 h-4 text-background-darkYellow transition-transform group-hover/lesson:scale-110" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span 
                                className={`text-sm ${
                                  isPreview 
                                    ? 'text-background-darkYellow font-medium underline-offset-4 group-hover/lesson:underline' 
                                    : 'text-gray-700 group-hover/lesson:text-gray-900'
                                }`}
                              >
                                {i + 1}. {lesson}
                              </span>
                              <div className="flex items-center gap-1.5 mt-1 sm:hidden">
                                <PlayCircle className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{fakeDuration}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0 pl-4 hidden sm:flex">
                            {isPreview && (
                              <span className="text-sm font-medium text-background-darkYellow underline-offset-4 hover:underline">
                                Preview
                              </span>
                            )}
                            <span className="text-sm text-gray-500 font-medium w-12 text-right">
                              {fakeDuration}
                            </span>
                          </div>
                        </div>
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
