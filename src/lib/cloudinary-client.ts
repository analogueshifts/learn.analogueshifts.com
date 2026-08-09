// Client-side helper for uploading a File to our own /api/upload route, which
// forwards it to Cloudinary (see src/lib/cloudinary.ts + src/app/api/upload/route.ts).
// Used for every browser upload in the app: thumbnails, intro/lesson videos,
// assignment resources, and avatars.
export type UploadFolder = "thumbnail" | "video" | "assignment" | "avatar";

export async function uploadToCloudinaryClient(file: File, folder: UploadFolder): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const body = await res.json();
  if (!body.success) throw new Error(body.error ?? "Upload failed");
  return body.data.url;
}
