import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const parsed = resetPasswordSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  let userId: string;
  try {
    const payload = jwt.verify(parsed.data.token, process.env.NEXTAUTH_SECRET!) as { userId: string };
    userId = payload.userId;
  } catch {
    return apiError("This reset link is invalid or has expired", 400);
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({ where: { id: userId }, data: { password: passwordHash } });

  return apiSuccess({ message: "Password updated successfully" });
}
