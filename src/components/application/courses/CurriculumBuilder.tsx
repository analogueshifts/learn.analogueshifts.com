"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2, Video, FileText, CheckSquare, ClipboardList, UploadCloud, Bold, Italic, Heading2, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// === TIPTAP EDITOR COMPONENT ===
const RichTextEditor = ({ content, onChange }: { content: string, onChange: (html: string) => void }) => {
  const [updateTicker, setUpdateTicker] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onTransaction: () => {
      // Force component re-render on selection or formatting changes
      setUpdateTicker(prev => prev + 1);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-4 py-3',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
      <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 p-2">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
          title="Bold"
        ><Bold className="w-4 h-4" /></button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
          title="Italic"
        ><Italic className="w-4 h-4" /></button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
          title="Heading"
        ><Heading2 className="w-4 h-4" /></button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
          title="Bullet List"
        ><List className="w-4 h-4" /></button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
          title="Ordered List"
        ><ListOrdered className="w-4 h-4" /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

// === LESSON EDITOR COMPONENT ===
const LessonEditor = ({ lesson, isFirstLesson, updateLesson }: { lesson: any, isFirstLesson: boolean, updateLesson: (id: string, field: string, value: any) => void }) => {
  return (
    <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-4">
      {/* Type Selector */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 w-full shadow-sm">
          {['video', 'article', 'quiz', 'assignment'].map(t => {
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
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white cursor-pointer hover:bg-gray-50 transition-all group relative overflow-hidden">
            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
            <p className="text-sm font-bold text-gray-900">Upload Video via UploadThing</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">MP4, WebM (Max 2GB)</p>
            {/* Mock Upload Progress */}
            {lesson.url && (
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gray-100">
                <div className="h-full bg-blue-500 w-[100%] transition-all"></div>
              </div>
            )}
          </div>
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
               <input type="number" defaultValue={80} className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-center focus:ring-2 focus:ring-background-darkYellow outline-none" />
               <span className="text-sm font-bold text-gray-500">%</span>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
            <input type="text" placeholder="Question Title (e.g. What is React?)" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-background-darkYellow outline-none" />
            
            <div className="space-y-2 pl-4">
              <div className="flex items-center gap-3">
                 <input type="radio" name={`q-${lesson.id}`} className="w-4 h-4 text-green-500 focus:ring-green-500" defaultChecked />
                 <input type="text" placeholder="A JavaScript library for building UIs" className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium focus:border-gray-400 outline-none" />
              </div>
              <div className="flex items-center gap-3">
                 <input type="radio" name={`q-${lesson.id}`} className="w-4 h-4 text-green-500 focus:ring-green-500" />
                 <input type="text" placeholder="A database management system" className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium focus:border-gray-400 outline-none" />
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-bold mt-2 hover:bg-blue-50">+ Add Option</Button>
            </div>
          </div>
          <Button variant="outline" className="w-full border-dashed border-gray-300 font-bold hover:bg-gray-50 text-gray-600">+ Add Question</Button>
        </div>
      )}

      {lesson.type === 'assignment' && (
        <div className="space-y-4">
           <textarea 
             rows={4} 
             placeholder="Describe the assignment requirements..." 
             value={lesson.description || ''}
             onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
             className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-background-darkYellow outline-none resize-none" 
           />
           <div className="relative group">
             <input 
               type="file" 
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
               onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) updateLesson(lesson.id, 'url', file.name);
               }} 
             />
             <Button variant={lesson.url ? "default" : "outline"} className={`w-full font-bold transition-all ${lesson.url ? 'bg-gray-900 text-white shadow-md' : 'border-gray-200 text-gray-700 bg-white group-hover:bg-gray-50'}`}>
               <UploadCloud className="w-4 h-4 mr-2" /> 
               {lesson.url ? `Attached: ${lesson.url}` : 'Attach Resources'}
             </Button>
           </div>
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

// === MAIN CURRICULUM BUILDER ===
export default function CurriculumBuilder() {
  const [sections, setSections] = useState([
    {
      id: "sec-1",
      title: "Section 1: Core Fundamentals",
      lessons: [
        { id: "l-1", title: "Welcome to the course!", type: "video", duration: "02:15", url: "uploaded", description: "", isExpanded: false },
        { id: "l-2", title: "Core Concepts Text", type: "article", duration: "05:00", url: "", description: "", isExpanded: false },
        { id: "l-3", title: "Knowledge Check", type: "quiz", duration: "00:00", url: "", description: "", isExpanded: false }
      ]
    }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (sectionId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections(sections.map(sec => {
        if (sec.id === sectionId) {
          const oldIndex = sec.lessons.findIndex(item => item.id === active.id);
          const newIndex = sec.lessons.findIndex(item => item.id === over.id);
          const newLessons = arrayMove(sec.lessons, oldIndex, newIndex);
          
          // Force first lesson of first section to be video
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
    setSections([...sections, {
      id: `sec-${Date.now()}`,
      title: `Section ${sections.length + 1}: New Section`,
      lessons: []
    }]);
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, title } : s));
  };

  const addLesson = (sectionId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          lessons: [...sec.lessons, { id: `l-${Date.now()}`, title: "New Lesson", type: "video", duration: "00:00", url: "", description: "", isExpanded: true }]
        };
      }
      return sec;
    }));
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, lessons: sec.lessons.filter(l => l.id !== lessonId) };
      }
      return sec;
    }));
  };

  const toggleExpand = (sectionId: string, lessonId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, lessons: sec.lessons.map(l => l.id === lessonId ? { ...l, isExpanded: !l.isExpanded } : l) };
      }
      return sec;
    }));
  };

  const updateLesson = (sectionId: string, lessonId: string, field: string, value: any) => {
    setSections(sections.map(sec => {
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
