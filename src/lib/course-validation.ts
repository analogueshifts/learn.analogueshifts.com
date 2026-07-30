export interface CurriculumLessonInput {
  title: string | null | undefined;
  type: "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT";
  videoUrl?: string | null;
  description?: string | null;
  quiz?: { questions: { question: string; options: string[] }[] } | null;
  assignment?: { description?: string | null; fileUrl?: string | null } | null;
}

export interface CurriculumSectionInput {
  lessons: CurriculumLessonInput[];
}

function stripHtml(value?: string | null): string {
  return (value ?? "").replace(/<[^>]*>/g, "").trim();
}

export function validateCurriculumContent(sections: CurriculumSectionInput[]): string | null {
  const totalLessons = sections.reduce((sum, section) => sum + section.lessons.length, 0);
  if (sections.length === 0 || totalLessons === 0) {
    return "Add at least one section with a lesson before submitting.";
  }

  for (const section of sections) {
    for (const lesson of section.lessons) {
      const label = lesson.title?.trim() || "A lesson";
      if (!lesson.title?.trim()) return "Every lesson needs a title.";

      switch (lesson.type) {
        case "VIDEO":
          if (!lesson.videoUrl?.trim()) {
            return `"${label}" is missing its video — upload a file or paste a link before submitting.`;
          }
          break;
        case "ARTICLE":
          if (!stripHtml(lesson.description)) {
            return `"${label}" needs article content before submitting.`;
          }
          break;
        case "QUIZ": {
          const questions = lesson.quiz?.questions ?? [];
          if (questions.length === 0) {
            return `"${label}" needs at least one quiz question before submitting.`;
          }
          for (const question of questions) {
            if (!question.question?.trim()) {
              return `"${label}" has a quiz question with no text.`;
            }
            if ((question.options ?? []).filter((o) => o.trim()).length < 2) {
              return `"${label}" has a quiz question with fewer than 2 answer options.`;
            }
          }
          break;
        }
        case "ASSIGNMENT":
          if (!lesson.assignment?.fileUrl?.trim() && !stripHtml(lesson.assignment?.description)) {
            return `"${label}" needs instructions or a reference file before submitting.`;
          }
          break;
      }
    }
  }

  return null;
}
