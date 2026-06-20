import jwt from "jsonwebtoken";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const GENERIC_MESSAGE = "If an account exists for that email, a reset link has been sent.";

export async function POST(request: Request) {
  const parsed = forgotPasswordSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  // Always respond the same way regardless of whether the user exists, to avoid email enumeration.
  if (user) {
    const token = jwt.sign({ userId: user.id }, process.env.NEXTAUTH_SECRET!, { expiresIn: "1h" });
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "AnalogueShifts LMS <no-reply@analogueshifts.com>",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
      });
    } else {
      console.log(`[dev] Password reset link for ${user.email}: ${resetLink}`);
    }
  }

  return apiSuccess({ message: GENERIC_MESSAGE });
}
