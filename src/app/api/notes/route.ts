import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const courseId = request.nextUrl.searchParams.get("courseId");
  if (!courseId) return apiError("courseId is required", 422);

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id, lesson: { section: { courseId } } },
    include: { lesson: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(notes);
}

const createNoteSchema = z.object({
  lessonId: z.string(),
  timestamp: z.number().min(0).default(0),
  content: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const parsed = createNoteSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const note = await prisma.note.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return apiSuccess(note, 201);
}
