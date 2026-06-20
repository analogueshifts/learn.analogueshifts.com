import { getServerSession } from "next-auth";
import PDFDocument from "pdfkit";
import { apiError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { course: true } }, user: true },
  });

  if (!order || order.userId !== session.user.id) return apiError("Order not found", 404);

  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text("Invoice", { align: "right" });
  doc.fontSize(10).text(`Order ID: ${order.id}`, { align: "right" });
  doc.text(`Date: ${order.createdAt.toLocaleDateString()}`, { align: "right" });
  doc.moveDown(2);

  doc.fontSize(12).text(`Billed to: ${order.user.name}`);
  doc.text(order.user.email);
  doc.moveDown(2);

  for (const item of order.items) {
    doc.text(`${item.course.title}`, { continued: true });
    doc.text(`$${item.price.toFixed(2)}`, { align: "right" });
  }

  doc.moveDown();
  doc.fontSize(14).text(`Total: $${order.totalAmount.toFixed(2)} ${order.currency}`, { align: "right" });
  doc.fontSize(10).text(`Status: ${order.status}`, { align: "right" });

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${order.id}.pdf"`,
    },
  });
}
