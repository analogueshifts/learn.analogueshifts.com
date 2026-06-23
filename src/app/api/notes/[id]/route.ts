import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function getOwnedNote(id: string, userId: string) {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note || note.userId !== userId) return null;
  return note;
}

const updateNoteSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  timestamp: z.number().min(0).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const { id } = await params;
  const note = await getOwnedNote(id, session.user.id);
  if (!note) return apiError("Note not found", 404);

  const parsed = updateNoteSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.note.update({ where: { id }, data: parsed.data });
  return apiSuccess(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const { id } = await params;
  const note = await getOwnedNote(id, session.user.id);
  if (!note) return apiError("Note not found", 404);

  await prisma.note.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
