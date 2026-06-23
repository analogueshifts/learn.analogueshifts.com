import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

// Public, unauthenticated -- powers public trainer/student profile pages.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      jobTitle: true,
      skills: true,
      linkedin: true,
      twitter: true,
      github: true,
      role: true,
      createdAt: true,
      trainerProfile: { select: { expertise: true, portfolio: true, verifiedAt: true } },
      courses: {
        where: { status: "LIVE" },
        select: { id: true, slug: true, title: true, thumbnailUrl: true },
      },
      _count: { select: { enrollments: true, certificates: true } },
    },
  });

  if (!user) return apiError("User not found", 404);

  const { _count, courses, ...rest } = user;

  return apiSuccess({
    ...rest,
    coursesTaught: rest.role === "TRAINER" ? courses : undefined,
    coursesCompleted: rest.role !== "TRAINER" ? _count.certificates : undefined,
    coursesEnrolled: rest.role !== "TRAINER" ? _count.enrollments : undefined,
  });
}
