import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import coursesData from "@/resources/courses.json";
import { LessonType, SkillLevel } from "@/generated/prisma/enums";
import { seedAchievements } from "@/lib/achievements";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

function mapSkillLevel(level: string): SkillLevel {
  const upper = level.toUpperCase();
  return upper in SkillLevel ? (upper as SkillLevel) : SkillLevel.BEGINNER;
}

type RawLesson =
  | string
  | {
      title: string;
      type?: string;
      duration?: string;
      description?: string;
      questions?: unknown;
    };

function mapLessonType(type?: string): LessonType {
  const upper = type?.toUpperCase();
  return upper && upper in LessonType ? (upper as LessonType) : LessonType.VIDEO;
}

// Seeds the course catalog from the existing frontend mock data (src/resources/courses.json)
// so already-built course pages have real data to switch over to. Idempotent via upsert on slug.
// Dev-only: never reachable in production.
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const trainer = await prisma.user.upsert({
    where: { email: "seed-trainer@dev.local" },
    create: { email: "seed-trainer@dev.local", name: "Demo Trainer", role: "TRAINER" },
    update: {},
  });

  const reviewer = await prisma.user.upsert({
    where: { email: "seed-student@dev.local" },
    create: { email: "seed-student@dev.local", name: "Demo Student", role: "STUDENT" },
    update: {},
  });

  await seedAchievements();

  let courseCount = 0;

  const courses = coursesData as any[];
  for (let index = 0; index < courses.length; index++) {
    const raw = courses[index];
    const isFeatured = index < 3;
    const category = await prisma.category.upsert({
      where: { name: raw.courseName },
      create: { name: raw.courseName, slug: slugify(raw.courseName) },
      update: {},
    });

    const course = await prisma.course.upsert({
      where: { slug: raw.slug },
      create: {
        slug: raw.slug,
        title: raw.name,
        subtitle: raw.headline,
        description: raw.description,
        thumbnailUrl: raw.thumbnail,
        previewUrl: raw.preview,
        price: parsePrice(raw.price),
        level: mapSkillLevel(raw.skillLevel),
        totalDuration: raw.duration,
        status: "LIVE",
        isFeatured,
        categoryId: category.id,
        trainerId: trainer.id,
      },
      update: {
        title: raw.name,
        subtitle: raw.headline,
        description: raw.description,
        thumbnailUrl: raw.thumbnail,
        previewUrl: raw.preview,
        price: parsePrice(raw.price),
        level: mapSkillLevel(raw.skillLevel),
        totalDuration: raw.duration,
        isFeatured,
        categoryId: category.id,
      },
    });

    // Replace sections/lessons wholesale on each reseed to keep this idempotent and simple.
    await prisma.section.deleteMany({ where: { courseId: course.id } });

    const contents = raw.contents ?? [];
    for (let sectionIndex = 0; sectionIndex < contents.length; sectionIndex++) {
      const content = contents[sectionIndex];
      const section = await prisma.section.create({
        data: { title: content.title, order: sectionIndex, courseId: course.id },
      });

      const lessons: RawLesson[] = content.lessons ?? [];
      for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex++) {
        const lesson = lessons[lessonIndex];
        const isObject = typeof lesson === "object";
        await prisma.lesson.create({
          data: {
            title: isObject ? lesson.title : lesson,
            type: mapLessonType(isObject ? lesson.type : undefined),
            duration: isObject ? lesson.duration : undefined,
            description: isObject ? lesson.description : undefined,
            content: isObject && lesson.questions ? { questions: lesson.questions } : undefined,
            isFreePreview: sectionIndex === 0 && lessonIndex === 0,
            order: lessonIndex,
            sectionId: section.id,
          },
        });
      }
    }

    if (raw.review) {
      await prisma.review.deleteMany({ where: { courseId: course.id, studentId: reviewer.id } });
      await prisma.review.create({
        data: { rating: 5, body: raw.review, courseId: course.id, studentId: reviewer.id },
      });
    }

    courseCount += 1;
  }

  return NextResponse.json({ success: true, coursesSeeded: courseCount });
}
