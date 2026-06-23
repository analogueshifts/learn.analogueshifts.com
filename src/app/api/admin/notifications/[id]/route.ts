import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const notification = await prisma.adminNotification.findUnique({ where: { id } });
  if (!notification) return apiError("Notification not found", 404);

  const updated = await prisma.adminNotification.update({ where: { id }, data: { read: true } });
  return apiSuccess(updated);
}
