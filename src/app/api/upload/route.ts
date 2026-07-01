import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED_FOLDERS = {
  thumbnail: "lms/thumbnails",
  assignment: "lms/assignments",
  avatar: "lms/avatars",
} as const;

type UploadFolder = keyof typeof ALLOWED_FOLDERS;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folderKey = (formData.get("folder") as string | null) ?? "thumbnail";

  if (!file) return apiError("No file provided", 400);

  const folder = ALLOWED_FOLDERS[folderKey as UploadFolder] ?? ALLOWED_FOLDERS.thumbnail;
  const resourceType = file.type.startsWith("image/") ? "image" : "raw";

  if (file.size > 10 * 1024 * 1024) return apiError("File too large (max 10MB)", 400);

  const buffer = Buffer.from(await file.arrayBuffer());

  const { url, publicId } = await uploadToCloudinary(buffer, folder, resourceType);

  return apiSuccess({ url, publicId });
}
