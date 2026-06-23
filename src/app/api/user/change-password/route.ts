import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const parsed = changePasswordSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) return apiError("This account doesn't use a password (OAuth-only)", 400);

  const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!isValid) return apiError("Current password is incorrect", 401);

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: passwordHash } });

  return apiSuccess({ message: "Password updated successfully" });
}
