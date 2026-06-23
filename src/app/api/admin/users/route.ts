import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const where: Record<string, unknown> = {};
  if (role) where.role = role.toUpperCase();
  if (status) where.status = status.toUpperCase();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(users);
}

const createUserSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["STUDENT", "TRAINER", "ADMIN"]).default("STUDENT"),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const parsed = createUserSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return apiError("A user with this email already exists", 409);

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: { ...parsed.data, password: passwordHash },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  return apiSuccess(user, 201);
}
