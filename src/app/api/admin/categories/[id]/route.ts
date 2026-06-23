import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const updateCategorySchema = z.object({ name: z.string().min(2).max(80) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return apiError("Category not found", 404);

  const parsed = updateCategorySchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.category.update({ where: { id }, data: { name: parsed.data.name } });
  return apiSuccess(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return apiError("Category not found", 404);

  await prisma.category.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
