"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, UploadCloud, Video, Image as ImageIcon, GripVertical, Plus, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurriculumBuilder from "@/components/application/courses/CurriculumBuilder";

export default function CreateCoursePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Form States
  const [isPaid, setIsPaid] = useState(true);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [thumbFile, setThumbFile] = useState<string | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Curriculum State
  const [sections, setSections] = useState([
    { 
      id: 1, 
      title: "Section 1: Introduction", 
      lessons: [
        { id: 101, title: "Welcome to the course!", type: "video", duration: "02:15", url: "", description: "", isExpanded: false },
        { id: 102, title: "Setup your environment", type: "text", duration: "05:00", url: "", description: "", isExpanded: false }
      ] 
    }
  ]);

  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: `New Section ${sections.length + 1}`, lessons: [] }]);
  };

  const deleteSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const addLesson = (sectionId: number) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lessons: [...s.lessons, { id: Date.now(), title: "New Lesson", type: "video", duration: "00:00", url: "", description: "", isExpanded: true }]
        };
      }
      return s;
    }));
  };

  const deleteLesson = (sectionId: number, lessonId: number) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) };
      }
      return s;
    }));
  };

  const toggleLessonExpand = (sectionId: number, lessonId: number) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { 
          ...s, 
          lessons: s.lessons.map(l => l.id === lessonId ? { ...l, isExpanded: !l.isExpanded } : l) 
        };
      }
      return s;
    }));
  };

  const updateLessonData = (sectionId: number, lessonId: number, field: string, value: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { 
          ...s, 
          lessons: s.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l) 
        };
      }
      return s;
    }));
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
  };

  const handlePreview = () => {
    // In a real app, this would open a new tab to `/courses/preview/:draftId`
    alert("Opening Course Preview in a new tab... (Mock)");
  };

  const handleSubmit = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Course submitted for review!");
      router.push("/trainer/courses");
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-8 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-gray-50/90 backdrop-blur-md z-10 py-4 border-b border-gray-200/50 -mx-6 px-6 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100">
            <Link href="/trainer/courses"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <div className="text-xs font-bold text-background-darkYellow uppercase tracking-wider mb-0.5">Draft Course</div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create New Course</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-sm font-medium text-gray-500 hidden sm:inline-block mr-2 animate-in fade-in">
              Saved at {lastSaved}
            </span>
          )}
          <Button variant="outline" onClick={handlePreview} className="bg-white border-gray-200 font-bold">Preview</Button>
          <Button onClick={handleSaveDraft} disabled={isSaving} className="bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-md w-32 transition-all">
            {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Draft</>}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 top-24">
          <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-2">
            <TabsTrigger 
              value="basic" 
              className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent font-bold text-gray-500 data-[state=active]:text-gray-900 transition-all"
            >
              1. Basic Information
            </TabsTrigger>
            <TabsTrigger 
              value="media" 
              className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent font-bold text-gray-500 data-[state=active]:text-gray-900 transition-all"
            >
              2. Intro Video & Media
            </TabsTrigger>
            <TabsTrigger 
              value="curriculum" 
              className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent font-bold text-gray-500 data-[state=active]:text-gray-900 transition-all"
            >
              3. Curriculum Builder
            </TabsTrigger>
            <TabsTrigger 
              value="pricing" 
              className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent font-bold text-gray-500 data-[state=active]:text-gray-900 transition-all"
            >
              4. Pricing & Publish
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* TAB 1: BASIC INFO */}
          <TabsContent value="basic" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-gray-200 shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-8 bg-gray-50/50">
                <CardTitle className="text-xl font-extrabold text-gray-900">Basic Information</CardTitle>
                <CardDescription>Give your course a compelling title and description to attract students.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Course Title <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. Complete React Native Bootcamp 2026" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium" />
                  <p className="text-xs text-gray-500">A good title is catchy and describes exactly what the student will learn.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Course Subtitle</label>
                  <input type="text" placeholder="e.g. Master mobile app development from scratch" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Category</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium appearance-none">
                      <option value="">Select a category</option>
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Level</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium appearance-none">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                      <option value="all">All Levels</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Detailed Description</label>
                  <textarea rows={6} placeholder="Describe what students will learn, requirements, and who this course is for..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium resize-none" />
                </div>
              </CardContent>
              <div className="p-6 border-t border-gray-100 flex justify-end">
                <Button onClick={() => setActiveTab("media")} className="bg-background-darkYellow hover:bg-yellow-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-background-darkYellow/20">
                  Save & Continue to Media
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: MEDIA & INTRO VIDEO */}
          <TabsContent value="media" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-gray-200 shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-8 bg-gray-50/50">
                <CardTitle className="text-xl font-extrabold text-gray-900">Intro Video & Media</CardTitle>
                <CardDescription>First impressions matter. Upload a high-quality thumbnail and an engaging intro video.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                {/* Intro Video Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Promotional Intro Video <span className="text-red-500">*</span></h3>
                  <p className="text-sm text-gray-500 mb-4">Students who watch a well-made promo video are 5x more likely to enroll. Keep it under 2 minutes.</p>
                  
                  <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => e.target.files && setVideoFile(e.target.files[0].name)} />
                  
                  <div 
                    onClick={() => videoInputRef.current?.click()}
                    className={`border-2 border-dashed ${videoFile ? 'border-green-400 bg-green-50/50' : 'border-gray-300 hover:bg-gray-50 hover:border-background-darkYellow'} rounded-2xl p-12 text-center transition-all cursor-pointer group`}
                  >
                    {videoFile ? (
                      <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h4 className="font-extrabold text-gray-900 text-lg mb-1">{videoFile}</h4>
                        <p className="text-sm text-green-600 font-medium">Video selected successfully</p>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                          <Video className="w-10 h-10 text-blue-500" />
                        </div>
                        <h4 className="font-extrabold text-gray-900 text-lg mb-1">Click to upload Intro Video</h4>
                        <p className="text-sm text-gray-500 font-medium mb-6">MP4, WebM or MOV (Max 1GB)</p>
                        <Button variant="outline" className="pointer-events-none bg-white border-gray-200 font-bold">Select File</Button>
                      </>
                    )}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Course Thumbnail */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Course Thumbnail Image</h3>
                  <p className="text-sm text-gray-500 mb-4">This image will represent your course on the marketplace. Use a 16:9 aspect ratio.</p>
                  
                  <input 
                    type="file" 
                    ref={thumbInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setThumbFile(e.target.files[0].name);
                        setThumbPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }} 
                  />

                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-full sm:w-64 h-36 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                      {thumbPreview ? (
                        <img src={thumbPreview} alt="Thumbnail Preview" className="absolute inset-0 w-full h-full object-cover object-center" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div 
                      onClick={() => thumbInputRef.current?.click()}
                      className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 hover:border-background-darkYellow transition-all cursor-pointer w-full"
                    >
                      {thumbFile ? <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" /> : <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />}
                      <p className="text-sm font-bold text-gray-900">{thumbFile ? 'Change Image' : 'Upload Image'}</p>
                      <p className="text-xs text-gray-500 mt-1">JPEG or PNG, 1280x720px</p>
                    </div>
                  </div>
                </div>

              </CardContent>
              <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50/30">
                <Button variant="outline" onClick={() => setActiveTab("basic")} className="font-bold bg-white">Back to Basic Info</Button>
                <Button onClick={() => setActiveTab("curriculum")} className="bg-background-darkYellow hover:bg-yellow-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-background-darkYellow/20">
                  Save & Continue to Curriculum
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: CURRICULUM BUILDER */}
          <TabsContent value="curriculum" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-gray-200 shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-8 bg-gray-50/50">
                <CardTitle className="text-xl font-extrabold text-gray-900">Curriculum Builder</CardTitle>
                <CardDescription>Organize your course into sections and lessons. Add video content, quizzes, and resources.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-gray-50/30">
                <CurriculumBuilder />

              </CardContent>
              <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50/30">
                <Button variant="outline" onClick={() => setActiveTab("media")} className="font-bold bg-white">Back to Media</Button>
                <Button onClick={() => setActiveTab("pricing")} className="bg-background-darkYellow hover:bg-yellow-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-background-darkYellow/20">
                  Save & Continue to Pricing
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 4: PRICING */}
          <TabsContent value="pricing" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-gray-200 shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-8 bg-gray-50/50">
                <CardTitle className="text-xl font-extrabold text-gray-900">Pricing & Publish</CardTitle>
                <CardDescription>Set the price for your course. You can offer it for free or as a paid enrollment.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                
                <div className="space-y-4">
                  <div onClick={() => setIsPaid(true)} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${isPaid ? 'border-background-darkYellow bg-[#FFFBEC]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                    <input type="radio" checked={isPaid} readOnly className="w-5 h-5 text-background-darkYellow focus:ring-background-darkYellow" />
                    <div>
                      <label className="font-bold text-gray-900 block cursor-pointer">Paid Course</label>
                      <p className="text-sm text-gray-600">Students must pay to access the curriculum.</p>
                    </div>
                  </div>
                  <div onClick={() => setIsPaid(false)} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${!isPaid ? 'border-background-darkYellow bg-[#FFFBEC]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                    <input type="radio" checked={!isPaid} readOnly className="w-5 h-5 text-gray-900 focus:ring-gray-900" />
                    <div>
                      <label className="font-bold text-gray-900 block cursor-pointer">Free Course</label>
                      <p className="text-sm text-gray-600">Anyone can enroll for free. Good for lead generation.</p>
                    </div>
                  </div>
                </div>

                {isPaid && (
                  <div className="space-y-2 mt-6 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-bold text-gray-900">Course Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                      <input type="number" placeholder="99.99" className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-bold text-lg" />
                    </div>
                  </div>
                )}

              </CardContent>
              <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50/30">
                <Button variant="outline" onClick={() => setActiveTab("curriculum")} className="font-bold bg-white">Back to Curriculum</Button>
                <Button onClick={handleSubmit} disabled={isSaving} className="bg-gray-900 hover:bg-gray-800 text-white font-bold h-12 px-8 rounded-xl shadow-lg w-48">
                  {isSaving ? "Submitting..." : "Submit for Review"}
                </Button>
              </div>
            </Card>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
