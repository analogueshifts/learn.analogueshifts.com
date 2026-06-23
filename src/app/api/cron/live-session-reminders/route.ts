import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCron } from "@/lib/require-cron";

async function sendReminder(subject: string, recipients: string[], html: string) {
  if (recipients.length === 0) return;
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.batch.send(
      recipients.map((to) => ({ from: "AnalogueShifts LMS <no-reply@analogueshifts.com>", to, subject, html }))
    );
  } else {
    console.log(`[dev] "${subject}" would be emailed to ${recipients.length} recipients`);
  }
}

// Runs hourly via Vercel Cron (see vercel.json). Sends a reminder once per session at the
// ~24h and ~1h marks, using a 65-minute lookahead window so an hourly cron can't skip a session.
export async function GET(request: Request) {
  if (!requireCron(request)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in24hWindowEnd = new Date(in24h.getTime() + 65 * 60 * 1000);
  const in1h = new Date(now.getTime() + 60 * 60 * 1000);
  const in1hWindowEnd = new Date(in1h.getTime() + 65 * 60 * 1000);

  const [due24h, due1h] = await Promise.all([
    prisma.liveSession.findMany({
      where: { scheduledAt: { gte: in24h, lt: in24hWindowEnd }, reminder24hSentAt: null },
      include: { course: { include: { enrollments: { include: { user: { select: { email: true } } } } } } },
    }),
    prisma.liveSession.findMany({
      where: { scheduledAt: { gte: in1h, lt: in1hWindowEnd }, reminder1hSentAt: null },
      include: { course: { include: { enrollments: { include: { user: { select: { email: true } } } } } } },
    }),
  ]);

  for (const session of due24h) {
    const recipients = session.course.enrollments.map((e) => e.user.email);
    await sendReminder(
      `Reminder: "${session.title}" is tomorrow`,
      recipients,
      `<p>"${session.title}" starts in 24 hours. Join here: ${session.meetingLink}</p>`
    );
    await prisma.liveSession.update({ where: { id: session.id }, data: { reminder24hSentAt: now } });
  }

  for (const session of due1h) {
    const recipients = session.course.enrollments.map((e) => e.user.email);
    await sendReminder(
      `Starting soon: "${session.title}"`,
      recipients,
      `<p>"${session.title}" starts in 1 hour. Join here: ${session.meetingLink}</p>`
    );
    await prisma.liveSession.update({ where: { id: session.id }, data: { reminder1hSentAt: now } });
  }

  return NextResponse.json({ sent24h: due24h.length, sent1h: due1h.length });
}
