import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const createCategorySchema = z.object({ name: z.string().min(2).max(80) });

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const parsed = createCategorySchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const existing = await prisma.category.findUnique({ where: { name: parsed.data.name } });
  if (existing) return apiError("A category with this name already exists", 409);

  const category = await prisma.category.create({
    data: { name: parsed.data.name, slug: slugify(parsed.data.name) },
  });

  return apiSuccess(category, 201);
}
