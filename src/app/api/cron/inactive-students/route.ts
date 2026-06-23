import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCron } from "@/lib/require-cron";

const INACTIVITY_DAYS = 14;

// Runs daily via Vercel Cron. Flags students enrolled in a course with no lesson activity
// in INACTIVITY_DAYS by creating an AdminNotification (deduped per student per run-window).
export async function GET(request: Request) {
  if (!requireCron(request)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const cutoff = new Date(Date.now() - INACTIVITY_DAYS * 24 * 60 * 60 * 1000);

  const enrollments = await prisma.enrollment.findMany({
    where: { enrolledAt: { lt: cutoff } },
    include: { user: { select: { id: true, name: true } }, course: { select: { title: true } } },
  });

  let flagged = 0;

  for (const enrollment of enrollments) {
    const recentActivity = await prisma.lessonProgress.findFirst({
      where: { userId: enrollment.userId, lastAccessedAt: { gte: cutoff } },
    });
    if (recentActivity) continue;

    const alreadyFlagged = await prisma.adminNotification.findFirst({
      where: {
        title: "Inactive student",
        message: { contains: enrollment.userId },
        createdAt: { gte: new Date(Date.now() - INACTIVITY_DAYS * 24 * 60 * 60 * 1000) },
      },
    });
    if (alreadyFlagged) continue;

    await prisma.adminNotification.create({
      data: {
        type: "WARNING",
        title: "Inactive student",
        message: `${enrollment.user.name} (${enrollment.userId}) hasn't accessed "${enrollment.course.title}" in over ${INACTIVITY_DAYS} days.`,
      },
    });
    flagged += 1;
  }

  return NextResponse.json({ flagged });
}
