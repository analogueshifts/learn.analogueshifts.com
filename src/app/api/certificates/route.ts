import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    include: { course: { select: { id: true, title: true, totalDuration: true, level: true, trainer: { select: { name: true } } } } },
    orderBy: { issuedAt: "desc" },
  });

  return apiSuccess(certificates);
}
