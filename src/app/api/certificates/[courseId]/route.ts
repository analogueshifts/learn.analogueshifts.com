import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

function generateCode() {
  const part = () => Math.random().toString().slice(2, 6);
  return `CERT-${part()}-${part()}`;
}

export async function POST(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const { courseId } = await params;

  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (existing) return apiSuccess(existing);

  const progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (!progress || progress.progressPercent !== 100) {
    return apiError("Course is not yet complete", 400);
  }

  let code = generateCode();
  while (await prisma.certificate.findUnique({ where: { code } })) {
    code = generateCode();
  }

  const certificate = await prisma.certificate.create({
    data: { userId: session.user.id, courseId, code },
  });

  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.course.findUnique({ where: { id: courseId } }),
  ]);
  if (user && course) {
    await sendEmail({
      to: user.email,
      subject: `You earned a certificate for "${course.title}"!`,
      html: `<p>Congratulations on completing "${course.title}"! Your certificate code is <strong>${code}</strong>.</p>`,
    });
  }

  return apiSuccess(certificate, 201);
}
