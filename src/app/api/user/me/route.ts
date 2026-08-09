import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function omitPassword<T extends { password: string | null }>(user: T) {
  const { password, ...rest } = user;
  return rest;
}

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}

export async function GET() {
  const user = await requireUser();
  if (!user) return apiError("Not authenticated", 401);

  return apiSuccess(omitPassword(user));
}

const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  bio: z.string().max(1000).optional(),
  location: z.string().max(120).optional(),
  jobTitle: z.string().max(120).optional(),
  skills: z.array(z.string().max(50)).max(30).optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  github: z.string().url().optional(),
  avatar: z.string().url().optional(),
});

export async function PATCH(request: Request) {
  const user = await requireUser();
  if (!user) return apiError("Not authenticated", 401);

  const parsed = updateProfileSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
  });

  return apiSuccess(omitPassword(updated));
}
