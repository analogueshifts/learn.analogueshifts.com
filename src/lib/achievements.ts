import { prisma } from "@/lib/prisma";

export const ACHIEVEMENT_DEFINITIONS = [
  { key: "FIRST_STEPS", name: "First Steps", description: "Completed your first lesson" },
  { key: "ON_FIRE", name: "On Fire", description: "Maintained a 7-day learning streak" },
  { key: "COURSE_CHAMPION", name: "Course Champion", description: "Completed an entire course" },
  { key: "HELPFUL_PEER", name: "Helpful Peer", description: "Answered 10 Q&A questions" },
  // Defined but not auto-awarded yet -- each needs a feature this phase doesn't build
  // (quiz-taking/scoring, leaderboard ranking, assignment early-submission tracking).
  { key: "SHARPSHOOTER", name: "Sharpshooter", description: "Scored 100% on 3 quizzes" },
  { key: "FAST_LEARNER", name: "Fast Learner", description: "Completed a module in record time" },
  { key: "TOP_1_PERCENT", name: "Top 1%", description: "Reached the top 1% of the leaderboard" },
  { key: "OVERACHIEVER", name: "Overachiever", description: "Submitted every assignment early" },
] as const;

export async function seedAchievements() {
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    await prisma.achievement.upsert({ where: { key: def.key }, create: def, update: def });
  }
}

async function award(userId: string, key: string) {
  const achievement = await prisma.achievement.findUnique({ where: { key } });
  if (!achievement) return;
  await prisma.userAchievement.upsert({
    where: { userId_achievementId: { userId, achievementId: achievement.id } },
    create: { userId, achievementId: achievement.id },
    update: {},
  });
}

// Called after a lesson/course progress update. Cheap idempotent checks only --
// upsert above no-ops if already earned, so it's safe to call on every progress sync.
export async function checkProgressAchievements(userId: string, courseId: string) {
  const completedLessonCount = await prisma.lessonProgress.count({
    where: { userId, completed: true },
  });
  if (completedLessonCount >= 1) await award(userId, "FIRST_STEPS");

  const courseProgress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (courseProgress?.progressPercent === 100) await award(userId, "COURSE_CHAMPION");

  const recentlyActiveDays = await prisma.lessonProgress.findMany({
    where: { userId, lastAccessedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    select: { lastAccessedAt: true },
  });
  const distinctDays = new Set(recentlyActiveDays.map((p) => p.lastAccessedAt.toISOString().slice(0, 10)));
  if (distinctDays.size >= 7) await award(userId, "ON_FIRE");
}

export async function checkQaAchievements(userId: string) {
  const answerCount = await prisma.answer.count({ where: { authorId: userId } });
  if (answerCount >= 10) await award(userId, "HELPFUL_PEER");
}
