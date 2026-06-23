import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "PENDING", "LIVE", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return apiError("Course not found", 404);

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.course.update({ where: { id }, data: parsed.data });
  return apiSuccess(updated);
}
