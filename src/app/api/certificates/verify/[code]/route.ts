import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

// Public, unauthenticated -- anyone with the code (e.g. via the QR on a printed certificate) can verify it.
export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { code },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true, totalDuration: true, level: true, trainer: { select: { name: true } } } },
    },
  });

  if (!certificate) return apiError("Certificate not found", 404);

  return apiSuccess({
    valid: true,
    code: certificate.code,
    studentName: certificate.user.name,
    courseTitle: certificate.course.title,
    instructorName: certificate.course.trainer.name,
    level: certificate.course.level,
    duration: certificate.course.totalDuration,
    issuedAt: certificate.issuedAt,
  });
}
