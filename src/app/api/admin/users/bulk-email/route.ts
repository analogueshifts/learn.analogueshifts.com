import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const bulkEmailSchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1),
  role: z.enum(["STUDENT", "TRAINER", "ADMIN"]).optional(),
  userIds: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const parsed = bulkEmailSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const { subject, body, role, userIds } = parsed.data;

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (userIds?.length) where.id = { in: userIds };

  const recipients = await prisma.user.findMany({ where, select: { email: true } });
  const emails = recipients.map((r) => r.email);

  if (emails.length > 0 && process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.batch.send(
      emails.map((to) => ({
        from: "AnalogueShifts LMS <no-reply@analogueshifts.com>",
        to,
        subject,
        html: `<p>${body}</p>`,
      }))
    );
  } else if (emails.length > 0) {
    console.log(`[dev] Bulk email "${subject}" would be sent to ${emails.length} recipients: ${emails.join(", ")}`);
  }

  return apiSuccess({ recipientCount: emails.length });
}
