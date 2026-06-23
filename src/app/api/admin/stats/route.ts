import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalUsers, activeCourses, todayOrders, monthOrders] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { status: "LIVE" } }),
    prisma.order.findMany({
      where: { status: "SUCCESS", createdAt: { gte: startOfToday } },
      select: { totalAmount: true },
    }),
    prisma.order.findMany({
      where: { status: "SUCCESS", createdAt: { gte: startOfMonth } },
      select: { totalAmount: true },
    }),
  ]);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const monthRevenue = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return apiSuccess({
    totalUsers,
    activeCourses,
    todayRevenue,
    monthRevenue,
  });
}
