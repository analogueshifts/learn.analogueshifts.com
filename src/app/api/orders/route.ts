import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id, status: "SUCCESS" },
    include: {
      items: {
        include: {
          course: { select: { id: true, title: true, slug: true, thumbnailUrl: true } },
        },
      },
      refunds: { select: { id: true, status: true, reason: true, requestedAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(orders);
}
