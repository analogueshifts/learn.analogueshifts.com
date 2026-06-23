import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { UploadThingError } from "uploadthing/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { id: metadata.userId },
        data: { avatar: file.ufsUrl },
      });
    }),

  // Mounted at /api/uploadthing (endpoint: "trainerVideoUploader"), same convention as avatarUploader.
  // Returns the video URL to the client -- the trainer dashboard then PATCHes it onto the lesson.
  trainerVideoUploader: f({ video: { maxFileSize: "1GB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { videoUrl: file.ufsUrl };
    }),

  courseThumbnailUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  assignmentResourceUploader: f({ blob: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
