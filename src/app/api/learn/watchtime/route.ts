import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { courseId, lessonId, watchTime, completed } = body;

    // Simulate saving to database
    console.log(`[WatchTime Sync] Course: ${courseId}, Lesson: ${lessonId}, Time: ${watchTime}s, Completed: ${completed}`);

    return NextResponse.json({ success: true, message: "Progress saved" });
  } catch (error) {
    console.error("[WatchTime Error]", error);
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}
