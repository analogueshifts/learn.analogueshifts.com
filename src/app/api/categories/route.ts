export const dynamic = "force-dynamic";

import { apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: { where: { status: "LIVE" } } } } },
    orderBy: { name: "asc" },
  });

  return apiSuccess(
    categories.map(({ _count, ...category }) => ({ ...category, courseCount: _count.courses }))
  );
}
