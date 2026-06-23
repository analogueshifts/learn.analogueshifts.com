import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const settings = await prisma.platformSetting.findMany();
  return apiSuccess(
    settings.reduce<Record<string, unknown>>((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {})
  );
}

const updateSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.unknown(),
});

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const parsed = updateSettingSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const { key, value } = parsed.data;
  const setting = await prisma.platformSetting.upsert({
    where: { key },
    create: { key, value: value as any },
    update: { value: value as any },
  });

  return apiSuccess(setting);
}
