import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const updateUserSchema = z.object({
  role: z.enum(["STUDENT", "TRAINER", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "BANNED"]).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const parsed = updateUserSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return apiError("User not found", 404);

  const updated = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  return apiSuccess(updated);
}
