"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CourseEditorForm from "@/components/application/courses/CourseEditorForm";

export default function AdminCreateCoursePage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 lg:p-10 max-w-[1200px] mx-auto flex items-center justify-center py-32 text-gray-400">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading...
        </div>
      }
    >
      <CourseEditorForm basePath="/admin" showTrainerPicker />
    </Suspense>
  );
}
