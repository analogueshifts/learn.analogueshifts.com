"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, UploadCloud, Video, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CurriculumBuilder, { SectionDraft, LessonType, createEmptySections } from "@/components/application/courses/CurriculumBuilder";
import { uploadToCloudinaryClient } from "@/lib/cloudinary-client";
import { validateCurriculumContent } from "@/lib/course-validation";

interface Category {
  id: string;
  name: string;
}

interface TrainerOption {
  id: string;
  name: string;
  email: string;
  status: string;
}

export default function CourseEditorForm({
  basePath,
  showTrainerPicker = false,
}: {
  /** Route prefix this form lives under, e.g. "/trainer" or "/admin". Drives the back link and post-submit redirect. */
  basePath: string;
  /** Show an "Assign to Trainer" field — only relevant when an admin is creating/editing a course on a trainer's behalf. */
  showTrainerPicker?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(!!editId);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(editId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState("");

  // Tab 1: Basic Information
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [description, setDescription] = useState("");

  // Tab 2: Media
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Tab 3: Curriculum
  const [sections, setSections] = useState<SectionDraft[]>(createEmptySections());

  // Tab 4: Pricing
  const [isPaid, setIsPaid] = useState(true);
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setCategories(body.data);
      });
  }, []);

  useEffect(() => {
    if (!showTrainerPicker) return;
    fetch("/api/admin/trainers")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setTrainers(body.data);
      });
  }, [showTrainerPicker]);

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/trainer/courses/${editId}`)
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) {
          toast.error(body.error ?? "Failed to load course");
          return;
        }
        const course = body.data;
        setTitle(course.title);
        setCategoryId(course.categoryId ?? "");
        setLevel(course.level);
        setDescription(course.description);
        setThumbnailUrl(course.thumbnailUrl ?? null);
        setPreviewUrl(course.previewUrl ?? null);
        setIsPaid(course.price > 0);
        setPrice(course.price > 0 ? String(course.price) : "");
        if (course.trainerId) setSelectedTrainerId(course.trainerId);

        if (course.sections?.length) {
          setSections(
            course.sections.map((section: any) => ({
              id: section.id,
              title: section.title,
              lessons: section.lessons.map((lesson: any) => ({
                id: lesson.id,
                title: lesson.title,
                type: lesson.type.toLowerCase() as LessonType,
                duration: lesson.duration ?? "",
                url: lesson.videoUrl ?? lesson.assignment?.fileUrl ?? "",
                fileName: undefined,
                description: lesson.description ?? lesson.assignment?.description ?? "",
                isExpanded: false,
                quizPassScore: lesson.quiz?.passScore ?? 80,
                quizQuestions: (lesson.quiz?.questions ?? []).map((q: any) => ({
                  id: q.id,
                  question: q.question,
                  options: q.options,
                  correctIndex: q.correctIndex,
                })),
              })),
            }))
          );
        }
      })
      .finally(() => setIsLoadingCourse(false));
  }, [editId]);

  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleIntroVideoFile = async (file: File) => {
    setIsUploadingVideo(true);
    try {
      const url = await uploadToCloudinaryClient(file, "video");
      setPreviewUrl(url);
    } catch {
      toast.error("Video upload failed. Check your Cloudinary configuration.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleThumbnailFile = async (file: File) => {
    setIsUploadingThumbnail(true);
    try {
      const url = await uploadToCloudinaryClient(file, "thumbnail");
      setThumbnailUrl(url);
    } catch {
      toast.error("Thumbnail upload failed. Check your Cloudinary configuration.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  async function ensureCourse() {
    if (courseId) return courseId;

    if (!title.trim() || description.trim().length < 10) {
      toast.error("Add a title and a description (10+ characters) before saving.");
      return null;
    }
    if (showTrainerPicker && !selectedTrainerId) {
      toast.error("Select which trainer this course should be attributed to.");
      setActiveTab("basic");
      return null;
    }

    const response = await fetch("/api/trainer/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        categoryId: categoryId || undefined,
        level,
        price: isPaid ? Math.round(parseFloat(price) || 0) : 0,
        trainerId: showTrainerPicker ? selectedTrainerId : undefined,
      }),
    });
    const body = await response.json();
    if (!body.success) {
      toast.error(body.error ?? "Failed to create course");
      return null;
    }
    setCourseId(body.data.id);
    return body.data.id as string;
  }

  async function syncCourseDetails(id: string) {
    const response = await fetch(`/api/trainer/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        categoryId: categoryId || undefined,
        level,
        price: isPaid ? Math.round(parseFloat(price) || 0) : 0,
        thumbnailUrl: thumbnailUrl || undefined,
        previewUrl: previewUrl || undefined,
      }),
    });
    const body = await response.json();
    if (!body.success) {
      toast.error(body.error ?? "Failed to save course details");
      return false;
    }
    return true;
  }

  async function pushCurriculum(id: string) {
    // Replace the whole curriculum on every save to avoid piling up duplicate
    // sections/lessons each time a draft (or an existing course) is re-saved.
    await fetch(`/api/trainer/courses/${id}/sections`, { method: "DELETE" });

    for (const section of sections) {
      const sectionRes = await fetch(`/api/trainer/courses/${id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: section.title }),
      });
      const sectionBody = await sectionRes.json();
      if (!sectionBody.success) continue;
      const sectionId = sectionBody.data.id;

      for (const lesson of section.lessons) {
        const type = lesson.type.toUpperCase();
        await fetch(`/api/trainer/courses/${id}/lessons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionId,
            title: lesson.title,
            type,
            videoUrl: lesson.type === "video" ? lesson.url || undefined : undefined,
            duration: lesson.duration || undefined,
            description: lesson.type === "article" ? lesson.description || undefined : undefined,
            isFreePreview: lesson.type === "video" && sections[0]?.id === section.id && section.lessons[0]?.id === lesson.id,
            quiz:
              lesson.type === "quiz" && lesson.quizQuestions.length > 0
                ? {
                    passScore: lesson.quizPassScore,
                    questions: lesson.quizQuestions
                      .filter((q) => q.question.trim())
                      .map((q) => ({ question: q.question, options: q.options, correctIndex: q.correctIndex })),
                  }
                : undefined,
            assignment:
              lesson.type === "assignment"
                ? { title: lesson.title, description: lesson.description || undefined, fileUrl: lesson.url || undefined }
                : undefined,
          }),
        });
      }
    }
  }

  const handleSaveDraft = async () => {
    if (isUploadingThumbnail || isUploadingVideo) {
      toast.error("Please wait for the upload to finish before saving.");
      return;
    }
    setIsSaving(true);
    const id = await ensureCourse();
    if (id) {
      const saved = await syncCourseDetails(id);
      if (saved) {
        await pushCurriculum(id);
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        toast.success("Draft saved");
      }
    }
    setIsSaving(false);
  };

  const handlePreview = () => {
    toast("Course preview isn't available until the course is published.");
  };

  const handleSubmit = async () => {
    if (isUploadingThumbnail || isUploadingVideo) {
      toast.error("Please wait for the upload to finish before submitting.");
      return;
    }
    if (showTrainerPicker && !selectedTrainerId) {
      toast.error("Select which trainer this course should be attributed to.");
      setActiveTab("basic");
      return;
    }

    const validationError = validateCurriculumContent(
      sections.map((section) => ({
        lessons: section.lessons.map((lesson) => ({
          title: lesson.title,
          type: lesson.type.toUpperCase() as "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT",
          videoUrl: lesson.type === "video" ? lesson.url : undefined,
          description: lesson.type === "article" ? lesson.description : undefined,
          quiz:
            lesson.type === "quiz"
              ? { questions: lesson.quizQuestions.map((q) => ({ question: q.question, options: q.options })) }
              : undefined,
          assignment:
            lesson.type === "assignment"
              ? { description: lesson.description, fileUrl: lesson.url }
              : undefined,
        })),
      }))
    );
    if (validationError) {
      toast.error(validationError);
      setActiveTab("curriculum");
      return;
    }

    setIsSaving(true);
    const id = await ensureCourse();
    if (!id) {
      setIsSaving(false);
      return;
    }
    const saved = await syncCourseDetails(id);
    if (!saved) {
      setIsSaving(false);
      return;
    }
    await pushCurriculum(id);

    const response = await fetch(`/api/trainer/courses/${id}/submit-review`, { method: "POST" });
    const body = await response.json();

    setIsSaving(false);
    if (!body.success) {
      toast.error(body.error ?? "Failed to submit for review");
      return;
    }

    toast.success("Course submitted for review!");
    router.push(`${basePath}/courses`);
  };

  if (isLoadingCourse) {
    return (
      <div className="p-6 lg:p-10 max-w-[1200px] mx-auto flex items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading course...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-8 pb-32">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-gray-50/90 backdrop-blur-md z-10 py-4 border-b border-gray-200/50 -mx-6 px-6 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100">
            <Link href={`${basePath}/courses`}><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <div className="text-xs font-bold text-background-darkYellow uppercase tracking-wider mb-0.5">{editId ? "Edit Course" : "Draft Course"}</div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{editId ? "Edit Course" : "Create New Course"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-sm font-medium text-gray-500 hidden sm:inline-block mr-2 animate-in fade-in">
              Saved at {lastSaved}
            </span>
          )}
          <Button variant="outline" onClick={handlePreview} className="bg-white border-gray-200 font-bold">Preview</Button>
          <Button onClick={handleSaveDraft} disabled={isSaving || isUploadingThumbnail || isUploadingVideo} className="bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-md w-32 transition-all">
            {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Draft</>}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8 items-start">

        <div className="w-full md:w-64 shrink-0 top-24">
          <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-2">
            <TabsTrigger value="basic" className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent font-bold text-gray-500 data-[state=active]:text-gray-900 transition-all">1. Basic Information</TabsTrigger>
            <TabsTrigger value="media" className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent font-bold text-gray-500 data-[state=active]:text-gray-900 transition-all">2. Intro Video & Media</TabsTrigger>
            <TabsTrigger value="curriculum" className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent font-bold text-gray-500 data-[state=active]:text-gray-900 transition-all">3. Curriculum Builder</TabsTrigger>
            <TabsTrigger value="pricing" className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent font-bold text-gray-500 data-[state=active]:text-gray-900 transition-all">4. Pricing & Publish</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 w-full min-w-0">

          {/* TAB 1: BASIC INFO */}
          <TabsContent value="basic" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-gray-200 shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-8 bg-gray-50/50">
                <CardTitle className="text-xl font-extrabold text-gray-900">Basic Information</CardTitle>
                <CardDescription>Give your course a compelling title and description to attract students.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {showTrainerPicker && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Assign to Trainer <span className="text-red-500">*</span></label>
                    <Select value={selectedTrainerId} onValueChange={setSelectedTrainerId} disabled={!!courseId}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 h-12">
                        <SelectValue placeholder="Select which trainer this course belongs to" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainers.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name} ({t.email}){t.status !== "ACTIVE" ? ` — ${t.status}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      {courseId
                        ? "The trainer is set when a course is created and can't be changed here."
                        : "This course will appear on the selected trainer's dashboard and be published under their name."}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Course Title <span className="text-red-500">*</span></label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Complete React Native Bootcamp 2026" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium" />
                  <p className="text-xs text-gray-500">A good title is catchy and describes exactly what the student will learn.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Category</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium appearance-none">
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium appearance-none">
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Detailed Description</label>
                  <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what students will learn, requirements, and who this course is for..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium resize-none" />
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

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Promotional Intro Video</h3>
                  <p className="text-sm text-gray-500 mb-4">Students who watch a well-made promo video are 5x more likely to enroll. Keep it under 2 minutes.</p>

                  <input type="file" id="intro-video-input" className="hidden" accept="video/*" onChange={(e) => e.target.files?.[0] && handleIntroVideoFile(e.target.files[0])} />

                  <label htmlFor="intro-video-input" className={`border-2 border-dashed ${previewUrl ? 'border-green-400 bg-green-50/50' : 'border-gray-300 hover:bg-gray-50 hover:border-background-darkYellow'} rounded-2xl p-12 text-center transition-all cursor-pointer group block`}>
                    {isUploadingVideo ? (
                      <>
                        <Loader2 className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-spin" />
                        <h4 className="font-extrabold text-gray-900 text-lg mb-1">Uploading...</h4>
                      </>
                    ) : previewUrl ? (
                      <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h4 className="font-extrabold text-gray-900 text-lg mb-1">Video uploaded successfully</h4>
                        <p className="text-sm text-green-600 font-medium">Click to replace</p>
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
                  </label>

                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs font-bold text-gray-400 uppercase">Or paste a video link</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <input
                    type="url"
                    value={previewUrl ?? ""}
                    onChange={(e) => setPreviewUrl(e.target.value || null)}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full mt-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-medium"
                  />
                </div>

                <hr className="border-gray-100" />

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Course Thumbnail Image</h3>
                  <p className="text-sm text-gray-500 mb-4">This image will represent your course on the marketplace. Use a 16:9 aspect ratio.</p>

                  <input type="file" id="thumbnail-input" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleThumbnailFile(e.target.files[0])} />

                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-full sm:w-64 h-36 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                      {thumbnailUrl ? (
                        <img src={thumbnailUrl} alt="Thumbnail Preview" className="absolute inset-0 w-full h-full object-cover object-center" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <label htmlFor="thumbnail-input" className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 hover:border-background-darkYellow transition-all cursor-pointer w-full block">
                      {isUploadingThumbnail ? <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" /> : thumbnailUrl ? <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" /> : <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />}
                      <p className="text-sm font-bold text-gray-900">{thumbnailUrl ? 'Change Image' : 'Upload Image'}</p>
                      <p className="text-xs text-gray-500 mt-1">JPEG or PNG, 1280x720px</p>
                    </label>
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
                <CurriculumBuilder sections={sections} onChange={setSections} />
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
                      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="99.99" className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:border-background-darkYellow focus:bg-white transition-all text-gray-900 font-bold text-lg" />
                    </div>
                  </div>
                )}

              </CardContent>
              <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50/30">
                <Button variant="outline" onClick={() => setActiveTab("curriculum")} className="font-bold bg-white">Back to Curriculum</Button>
                <Button onClick={handleSubmit} disabled={isSaving || isUploadingThumbnail || isUploadingVideo} className="bg-gray-900 hover:bg-gray-800 text-white font-bold h-12 px-8 rounded-xl shadow-lg w-48">
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
