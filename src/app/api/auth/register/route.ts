import bcrypt from "bcryptjs";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["Student", "Trainer"]),
});

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const { firstName, lastName, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return apiError("An account with this email already exists", 409);

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name: `${firstName} ${lastName}`,
      password: passwordHash,
      role: role.toUpperCase() as "STUDENT" | "TRAINER",
    },
  });

  return apiSuccess({ id: user.id, email: user.email, name: user.name, role: user.role }, 201);
}
