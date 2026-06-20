// Adapts the real Prisma Course shape (Phase 2 API) into the legacy shape that
// the existing frontend components were originally built against (src/resources/courses.json).
// This lets the already-built pages/components keep working unchanged while reading real data.

function levelToLabel(level: string) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

export function mapLessonType(type: string) {
  return type.toLowerCase() as "video" | "article" | "quiz" | "assignment";
}

export function mapApiCourseToLegacy(course: any) {
  return {
    id: course.id,
    slug: course.slug,
    name: course.title,
    headline: course.subtitle,
    description: course.description,
    thumbnail: course.thumbnailUrl,
    preview: course.previewUrl,
    price: course.price === 0 ? "Free" : `$${course.price}`,
    company: course.category?.name ?? "AnalogueShifts",
    duration: course.totalDuration,
    skillLevel: levelToLabel(course.level),
    courseName: course.category?.name,
    enrolledStudents: course.enrolledStudents ?? "—",
    instructor: course.trainer
      ? { name: course.trainer.name, image: course.trainer.avatar, about: course.trainer.bio }
      : undefined,
    whatToExpect: undefined as { summary: string; list: string[] } | undefined,
    review: course.reviews?.[0]?.body,
    contents: (course.sections ?? []).map((section: any) => ({
      id: section.id,
      title: section.title,
      lessons: (section.lessons ?? []).map((lesson: any) => ({
        title: lesson.title,
        type: mapLessonType(lesson.type),
        duration: lesson.duration ?? undefined,
        description: lesson.description ?? undefined,
        questions: lesson.content?.questions,
      })),
    })),
  };
}
