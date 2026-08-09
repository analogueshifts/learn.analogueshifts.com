import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED_FOLDERS = {
  thumbnail: { path: "lms/thumbnails", maxSize: 10 * 1024 * 1024, trainerOnly: true },
  video: { path: "lms/videos", maxSize: 100 * 1024 * 1024, trainerOnly: true },
  assignment: { path: "lms/assignments", maxSize: 32 * 1024 * 1024, trainerOnly: true },
  avatar: { path: "lms/avatars", maxSize: 5 * 1024 * 1024, trainerOnly: false },
} as const;

type UploadFolder = keyof typeof ALLOWED_FOLDERS;

function resourceTypeFor(file: File): "image" | "video" | "raw" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "raw";
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folderKey = (formData.get("folder") as string | null) ?? "thumbnail";
  const config = ALLOWED_FOLDERS[folderKey as UploadFolder] ?? ALLOWED_FOLDERS.thumbnail;

  if (!file) return apiError("No file provided", 400);

  if (config.trainerOnly && session.user.role !== "TRAINER" && session.user.role !== "ADMIN") {
    return apiError("Forbidden", 403);
  }

  if (file.size > config.maxSize) {
    return apiError(`File too large (max ${Math.round(config.maxSize / (1024 * 1024))}MB)`, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { url, publicId } = await uploadToCloudinary(buffer, config.path, resourceTypeFor(file));
    return apiSuccess({ url, publicId });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return apiError("Upload service is unavailable right now. Please try again in a moment.", 502);
  }
}
