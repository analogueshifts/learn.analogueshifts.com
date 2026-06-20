import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return apiError("Not authenticated", 401);

  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: { course: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(wishlist);
}

const toggleSchema = z.object({ courseId: z.string() });

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return apiError("Not authenticated", 401);

  const parsed = toggleSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const { courseId } = parsed.data;

  const existing = await prisma.wishlist.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return apiSuccess({ wishlisted: false });
  }

  await prisma.wishlist.create({ data: { userId, courseId } });
  return apiSuccess({ wishlisted: true });
}
