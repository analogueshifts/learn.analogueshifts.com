import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import PDFDocument from "pdfkit";
import { apiError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const courseId = request.nextUrl.searchParams.get("courseId");
  if (!courseId) return apiError("courseId is required", 422);

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { title: true } });
  if (!course) return apiError("Course not found", 404);

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id, lesson: { section: { courseId } } },
    include: { lesson: { select: { title: true } } },
    orderBy: [{ lessonId: "asc" }, { timestamp: "asc" }],
  });

  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text(`Notes: ${course.title}`);
  doc.moveDown(1.5);

  let currentLesson: string | null = null;
  for (const note of notes) {
    if (note.lesson.title !== currentLesson) {
      currentLesson = note.lesson.title;
      doc.moveDown(0.5).fontSize(14).text(currentLesson, { underline: true });
    }
    const minutes = Math.floor(note.timestamp / 60);
    const seconds = Math.floor(note.timestamp % 60).toString().padStart(2, "0");
    doc.fontSize(10).fillColor("#666").text(`@ ${minutes}:${seconds}`);
    doc.fontSize(11).fillColor("#000").text(note.content);
    doc.moveDown(0.5);
  }

  if (notes.length === 0) doc.fontSize(11).text("No notes yet for this course.");

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="notes-${courseId}.pdf"`,
    },
  });
}
