import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireTrainer() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  if (session.user.role !== "TRAINER" && session.user.role !== "ADMIN") return null;
  return session.user;
}
