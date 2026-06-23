import { prisma } from "@/lib/prisma";

export async function getOwnedCourse(courseId: string, trainerId: string, isAdmin: boolean) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return null;
  if (!isAdmin && course.trainerId !== trainerId) return null;
  return course;
}
