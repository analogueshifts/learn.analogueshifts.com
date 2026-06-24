export const dynamic = "force-dynamic";

import { apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { status: "LIVE", isFeatured: true },
    include: { category: true, trainer: { select: { id: true, name: true, avatar: true } } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(courses);
}
