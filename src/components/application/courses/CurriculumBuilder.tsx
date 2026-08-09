"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2, Video, FileText, CheckSquare, ClipboardList, UploadCloud, Bold, Italic, Heading2, List, ListOrdered, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import toast from "react-hot-toast";
import { uploadToCloudinaryClient } from "@/lib/cloudinary-client";

export type LessonType = "video" | "article" | "quiz" | "assignment";

export interface QuizQuestionDraft {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LessonDraft {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  url: string;
  fileName?: string;
  description: string;
  isExpanded: boolean;
  quizPassScore: number;
  quizQuestions: QuizQuestionDraft[];
}

export interface SectionDraft {
  id: string;
  title: string;
  lessons: LessonDraft[];
}

export const createEmptySections = (): SectionDraft[] => [
  {
    id: "sec-1",
    title: "Section 1: Introduction",
    lessons: [
      {
        id: "l-1",
        title: "Welcome to the course!",
        type: "video",
        duration: "",
        url: "",
        description: "",
        isExpanded: true,
        quizPassScore: 80,
        quizQuestions: [],
      },
    ],
  },
];

// === TIPTAP EDITOR COMPONENT ===
const RichTextEditor = ({ content, onChange }: { content: string, onChange: (html: string) => void }) => {
  const [, setUpdateTicker] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onTransaction: () => setUpdateTicker((prev) => prev + 1),
    editorProps: {
      attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-4 py-3' },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
      <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 p-2">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`} title="Bold"><Bold className="w-4 h-4" /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`} title="Italic"><Italic className="w-4 h-4" /></button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`} title="Heading"><Heading2 className="w-4 h-4" /></button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`} title="Bullet List"><List className="w-4 h-4" /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`} title="Ordered List"><ListOrdered className="w-4 h-4" /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

// === LESSON EDITOR COMPONENT ===
const LessonEditor = ({
  lesson,
  isFirstLesson,
  updateLesson,
}: {
  lesson: LessonDraft;
  isFirstLesson: boolean;
  updateLesson: (id: string, field: string, value: any) => void;
}) => {
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingResource, setIsUploadingResource] = useState(false);

  const startVideoUpload = async ([file]: File[]) => {
    setIsUploadingVideo(true);
    try {
      const url = await uploadToCloudinaryClient(file, "video");
      updateLesson(lesson.id, "url", url);
    } catch {
      toast.error("Video upload failed. Check your Cloudinary configuration.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const startResourceUpload = async ([file]: File[]) => {
    setIsUploadingResource(true);
    try {
      const url = await uploadToCloudinaryClient(file, "assignment");
      updateLesson(lesson.id, "url", url);
      updateLesson(lesson.id, "fileName", file.name);
    } catch {
      toast.error("Resource upload failed. Check your Cloudinary configuration.");
    } finally {
      setIsUploadingResource(false);
    }
  };

  const addQuestion = () => {
    updateLesson(lesson.id, "quizQuestions", [
      ...lesson.quizQuestions,
      { id: `q-${Date.now()}`, question: "", options: ["", ""], correctIndex: 0 },
    ]);
  };

  const updateQuestion = (qId: string, field: string, value: any) => {
    updateLesson(
      lesson.id,
      "quizQuestions",
      lesson.quizQuestions.map((q) => (q.id === qId ? { ...q, [field]: value } : q))
    );
  };

  const removeQuestion = (qId: string) => {
    updateLesson(lesson.id, "quizQuestions", lesson.quizQuestions.filter((q) => q.id !== qId));
  };

  const addOption = (qId: string) => {
    updateQuestion(qId, "options", [...(lesson.quizQuestions.find((q) => q.id === qId)?.options ?? []), ""]);
  };

  const updateOption = (qId: string, optionIndex: number, value: string) => {
    const question = lesson.quizQuestions.find((q) => q.id === qId);
    if (!question) return;
    const options = question.options.map((o, i) => (i === optionIndex ? value : o));
    updateQuestion(qId, "options", options);
  };

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-4">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 w-full shadow-sm">
          {(['video', 'article', 'quiz', 'assignment'] as LessonType[]).map((t) => {
            const isDisabled = isFirstLesson && t !== 'video';
            return (
              <button
                key={t}
                disabled={isDisabled}
                onClick={() => updateLesson(lesson.id, 'type', t)}
                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none min-w-[100px] ${lesson.type === t ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {t === 'video' && <Video className="w-3.5 h-3.5 shrink-0" />}
                {t === 'article' && <FileText className="w-3.5 h-3.5 shrink-0" />}
                {t === 'quiz' && <CheckSquare className="w-3.5 h-3.5 shrink-0" />}
                {t === 'assignment' && <ClipboardList className="w-3.5 h-3.5 shrink-0" />}
                <span className="truncate">{t}</span>
              </button>
            );
          })}
        </div>
        {isFirstLesson && (
          <p className="text-xs text-blue-600 font-medium px-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            The first lesson must be a Video. It is used as the public Course Preview.
          </p>
        )}
      </div>

      {lesson.type === 'video' && (
        <div className="space-y-4">
          <input
            type="text"
            value={lesson.duration}
            onChange={(e) => updateLesson(lesson.id, 'duration', e.target.value)}
            placeholder="Duration (e.g. 05:30)"
            className="w-40 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-background-darkYellow outline-none"
          />
          <input
            type="file"
            accept="video/*"
            className="hidden"
            id={`video-input-${lesson.id}`}
            onChange={(e) => e.target.files?.[0] && startVideoUpload([e.target.files[0]])}
          />
          <label
            htmlFor={`video-input-${lesson.id}`}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white cursor-pointer hover:bg-gray-50 transition-all group relative overflow-hidden block"
          >
            {isUploadingVideo ? (
              <>
                <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
                <p className="text-sm font-bold text-gray-900">Uploading...</p>
              </>
            ) : lesson.url ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900">Video uploaded</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">Click to replace</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                <p className="text-sm font-bold text-gray-900">Upload Video</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">MP4, WebM (Max 1GB)</p>
              </>
            )}
          </label>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase">Or paste a video link</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <input
            type="url"
            value={lesson.url}
            onChange={(e) => updateLesson(lesson.id, 'url', e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-background-darkYellow outline-none"
          />
        </div>
      )}

      {lesson.type === 'article' && (
        <RichTextEditor content={lesson.description || '<p>Start writing your article...</p>'} onChange={(html) => updateLesson(lesson.id, 'description', html)} />
      )}

      {lesson.type === 'quiz' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h4 className="font-extrabold text-gray-900 text-lg">Quiz Builder</h4>
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-700">Pass Score:</label>
              <input
                type="number"
                value={lesson.quizPassScore}
                onChange={(e) => updateLesson(lesson.id, 'quizPassScore', Number(e.target.value))}
                className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-center focus:ring-2 focus:ring-background-darkYellow outline-none"
              />
              <span className="text-sm font-bold text-gray-500">%</span>
            </div>
          </div>

          {lesson.quizQuestions.map((q) => (
            <div key={q.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                  placeholder="Question Title (e.g. What is React?)"
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-background-darkYellow outline-none"
                />
                <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)} className="h-9 w-9 text-gray-400 hover:text-red-500 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 pl-4">
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctIndex === optionIndex}
                      onChange={() => updateQuestion(q.id, 'correctIndex', optionIndex)}
                      className="w-4 h-4 text-green-500 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(q.id, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium focus:border-gray-400 outline-none"
                    />
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => addOption(q.id)} className="text-blue-600 text-xs font-bold mt-2 hover:bg-blue-50">+ Add Option</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addQuestion} className="w-full border-dashed border-gray-300 font-bold hover:bg-gray-50 text-gray-600">+ Add Question</Button>
        </div>
      )}

      {lesson.type === 'assignment' && (
        <div className="space-y-4">
          <textarea
            rows={4}
            placeholder="Describe the assignment requirements..."
            value={lesson.description}
            onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-background-darkYellow outline-none resize-none"
          />
          <input
            type="file"
            className="hidden"
            id={`resource-input-${lesson.id}`}
            onChange={(e) => e.target.files?.[0] && startResourceUpload([e.target.files[0]])}
          />
          <label htmlFor={`resource-input-${lesson.id}`} className="block">
            <Button asChild={false} variant={lesson.url ? "default" : "outline"} className={`w-full font-bold transition-all cursor-pointer ${lesson.url ? 'bg-gray-900 text-white shadow-md' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'}`}>
              <span>
                {isUploadingResource ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                ) : (
                  <><UploadCloud className="w-4 h-4 mr-2" /> {lesson.url ? `Attached: ${lesson.fileName ?? 'resource'}` : 'Attach Resources'}</>
                )}
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
};

// === SORTABLE LESSON ===
const SortableLessonItem = ({ lesson, isFirstLesson, deleteLesson, toggleExpand, updateLesson }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors group overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 p-3">
        <div {...attributes} {...listeners} className="p-1.5 hover:bg-gray-100 rounded-md cursor-grab touch-none">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {lesson.type === 'video' ? <Video className="w-4 h-4 text-blue-500 shrink-0" /> :
         lesson.type === 'article' ? <FileText className="w-4 h-4 text-green-500 shrink-0" /> :
         lesson.type === 'quiz' ? <CheckSquare className="w-4 h-4 text-purple-500 shrink-0" /> :
         <ClipboardList className="w-4 h-4 text-orange-500 shrink-0" />}

        <input
          type="text"
          value={lesson.title}
          onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
          className="font-bold text-sm text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 flex-1 min-w-[100px]"
        />
        {isFirstLesson && (
          <span className="hidden sm:inline-flex px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0 border border-blue-100 items-center">
            Course Preview
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={() => toggleExpand(lesson.id)} className="ml-2 h-8 px-3 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg">
          {lesson.isExpanded ? 'Close Editor' : 'Edit Content'}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => deleteLesson(lesson.id)} className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 ml-1 rounded-lg">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {lesson.isExpanded && (
        <LessonEditor lesson={lesson} isFirstLesson={isFirstLesson} updateLesson={updateLesson} />
      )}
    </div>
  );
};

interface CurriculumBuilderProps {
  sections: SectionDraft[];
  onChange: (sections: SectionDraft[]) => void;
}

// === MAIN CURRICULUM BUILDER ===
export default function CurriculumBuilder({ sections, onChange }: CurriculumBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (sectionId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onChange(sections.map(sec => {
        if (sec.id === sectionId) {
          const oldIndex = sec.lessons.findIndex(item => item.id === active.id);
          const newIndex = sec.lessons.findIndex(item => item.id === over.id);
          const newLessons = arrayMove(sec.lessons, oldIndex, newIndex);

          if (sectionId === sections[0].id && newLessons.length > 0 && newLessons[0].type !== 'video') {
            newLessons[0] = { ...newLessons[0], type: 'video' };
          }

          return { ...sec, lessons: newLessons };
        }
        return sec;
      }));
    }
  };

  const addSection = () => {
    onChange([...sections, {
      id: `sec-${Date.now()}`,
      title: `Section ${sections.length + 1}: New Section`,
      lessons: [],
    }]);
  };

  const deleteSection = (sectionId: string) => {
    onChange(sections.filter(s => s.id !== sectionId));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    onChange(sections.map(s => s.id === sectionId ? { ...s, title } : s));
  };

  const addLesson = (sectionId: string) => {
    onChange(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          lessons: [...sec.lessons, {
            id: `l-${Date.now()}`,
            title: "New Lesson",
            type: "video" as LessonType,
            duration: "",
            url: "",
            description: "",
            isExpanded: true,
            quizPassScore: 80,
            quizQuestions: [],
          }],
        };
      }
      return sec;
    }));
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    onChange(sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, lessons: sec.lessons.filter(l => l.id !== lessonId) };
      }
      return sec;
    }));
  };

  const toggleExpand = (sectionId: string, lessonId: string) => {
    onChange(sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, lessons: sec.lessons.map(l => l.id === lessonId ? { ...l, isExpanded: !l.isExpanded } : l) };
      }
      return sec;
    }));
  };

  const updateLesson = (sectionId: string, lessonId: string, field: string, value: any) => {
    onChange(sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, lessons: sec.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l) };
      }
      return sec;
    }));
  };

  const isGlobalFirstLesson = (sectionId: string, lessonIndex: number) => {
    return sections.length > 0 && sections[0].id === sectionId && lessonIndex === 0;
  };

  return (
    <div className="space-y-6 mb-12">
      {sections.map((section, sIndex) => (
        <div key={section.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-50/80 p-4 border-b border-gray-200 flex items-center gap-3">
            <GripVertical className="w-5 h-5 text-gray-300" />
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              className="font-extrabold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
            />
            {sections.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => deleteSection(section.id)} className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="p-5 space-y-3 bg-[#fdfdfd]">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(section.id, e)}>
              <SortableContext items={section.lessons} strategy={verticalListSortingStrategy}>
                {section.lessons.map((lesson, lIndex) => (
                  <SortableLessonItem
                    key={lesson.id}
                    lesson={lesson}
                    isFirstLesson={isGlobalFirstLesson(section.id, lIndex)}
                    deleteLesson={(id: string) => deleteLesson(section.id, id)}
                    toggleExpand={(id: string) => toggleExpand(section.id, id)}
                    updateLesson={(id: string, field: string, value: any) => updateLesson(section.id, id, field, value)}
                  />
                ))}
              </SortableContext>
            </DndContext>

            <Button variant="ghost" onClick={() => addLesson(section.id)} className="w-full border-2 border-dashed border-gray-200 text-gray-500 font-bold hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 mt-4 h-12 rounded-xl transition-all">
              <Plus className="w-4 h-4 mr-2" /> Add Lesson to {section.title}
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={addSection} className="w-full bg-transparent border-2 border-background-darkYellow text-background-darkYellow font-extrabold hover:bg-background-darkYellow/10 h-14 rounded-2xl transition-all shadow-sm">
        <Plus className="w-5 h-5 mr-2" /> Add New Section
      </Button>
    </div>
  );
}
