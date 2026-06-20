import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      trainer: { select: { id: true, name: true, avatar: true, bio: true, jobTitle: true } },
      sections: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { student: { select: { id: true, name: true, avatar: true } } },
      },
    },
  });

  if (!course || course.status !== "LIVE") return apiError("Course not found", 404);

  // No enrollment system yet (Phase 3) -- redact lesson content for anything that isn't a free preview.
  const sections = course.sections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) =>
      lesson.isFreePreview
        ? lesson
        : { ...lesson, videoUrl: null, description: null, content: null }
    ),
  }));

  const avgRating = course.reviews.length
    ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
    : 0;

  return apiSuccess({ ...course, sections, avgRating });
}
