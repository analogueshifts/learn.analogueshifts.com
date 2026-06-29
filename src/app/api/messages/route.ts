import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { resolveAudienceUserIds } from "@/lib/message-audience";

const sendSchema = z.object({
  audience: z.enum(["ALL", "STUDENTS", "TRAINERS", "ADMIN", "INDIVIDUAL"]).optional(),
  recipientId: z.string().optional(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const parsed = sendSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const isAdmin = session.user.role === "ADMIN";

  let audience = parsed.data.audience ?? "ADMIN";
  let recipientId = parsed.data.recipientId;

  if (!isAdmin) {
    // Students and trainers can only message the admin team.
    audience = "ADMIN";
    recipientId = undefined;
  } else if (audience === "INDIVIDUAL") {
    if (!recipientId) return apiError("Select a recipient for an individual message", 422);
    const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
    if (!recipient) return apiError("Recipient not found", 404);
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      audience,
      recipientId: audience === "INDIVIDUAL" ? recipientId : null,
      subject: parsed.data.subject,
      body: parsed.data.body,
    },
  });

  const recipientIds = (await resolveAudienceUserIds(audience, recipientId)).filter((id) => id !== session.user.id);

  if (recipientIds.length > 0) {
    const recipients = await prisma.user.findMany({
      where: { id: { in: recipientIds } },
      select: { id: true, role: true },
    });

    const senderLabel = `${session.user.name ?? "Someone"}`;
    const nonAdminRecipients = recipients.filter((r) => r.role !== "ADMIN");
    const hasAdminRecipient = recipients.some((r) => r.role === "ADMIN");

    await Promise.all([
      nonAdminRecipients.length > 0
        ? prisma.notification.createMany({
            data: nonAdminRecipients.map((r) => ({
              userId: r.id,
              type: "INFO",
              title: parsed.data.subject,
              message: `${senderLabel}: ${parsed.data.body}`,
              actionUrl: r.role === "TRAINER" ? "/trainer/messages" : "/student/messages",
            })),
          })
        : Promise.resolve(),
      hasAdminRecipient
        ? prisma.adminNotification.create({
            data: {
              type: "INFO",
              title: parsed.data.subject,
              message: `${senderLabel}: ${parsed.data.body}`,
              actionUrl: "/admin/messages",
            },
          })
        : Promise.resolve(),
    ]);
  }

  return apiSuccess({ ...message, recipientCount: recipientIds.length }, 201);
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") === "sent" ? "sent" : "inbox";
  const role = session.user.role;
  const userId = session.user.id;

  if (folder === "sent") {
    const messages = await prisma.message.findMany({
      where: { senderId: userId },
      orderBy: { createdAt: "desc" },
      include: { recipient: { select: { name: true } }, _count: { select: { reads: true } } },
    });

    const withReach = await Promise.all(
      messages.map(async (m) => {
        const recipientIds = (await resolveAudienceUserIds(m.audience, m.recipientId)).filter((id) => id !== m.senderId);
        return {
          id: m.id,
          subject: m.subject,
          body: m.body,
          audience: m.audience,
          recipientName: m.recipient?.name ?? null,
          createdAt: m.createdAt,
          recipientCount: recipientIds.length,
          readCount: m._count.reads,
        };
      })
    );

    return apiSuccess(withReach);
  }

  const visibilityFilters: Record<string, unknown>[] = [{ audience: "INDIVIDUAL", recipientId: userId }];
  if (role === "STUDENT") {
    visibilityFilters.push({ audience: "ALL" }, { audience: "STUDENTS" });
  } else if (role === "TRAINER") {
    visibilityFilters.push({ audience: "ALL" }, { audience: "TRAINERS" });
  } else if (role === "ADMIN") {
    visibilityFilters.push({ audience: "ALL" }, { audience: "ADMIN" });
  }

  const messages = await prisma.message.findMany({
    where: { OR: visibilityFilters },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { name: true, role: true, avatar: true } },
      reads: { where: { userId }, select: { id: true } },
    },
  });

  return apiSuccess(
    messages.map((m) => ({
      id: m.id,
      subject: m.subject,
      body: m.body,
      audience: m.audience,
      createdAt: m.createdAt,
      sender: m.sender,
      isRead: m.reads.length > 0,
    }))
  );
}
