"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Star, Medal, Award, Flame, Target, Zap, Crown, Loader2 } from "lucide-react";

const ICON_BY_KEY: Record<string, React.ReactNode> = {
  FIRST_STEPS: <Star className="w-8 h-8" />,
  ON_FIRE: <Flame className="w-8 h-8" />,
  SHARPSHOOTER: <Target className="w-8 h-8" />,
  FAST_LEARNER: <Zap className="w-8 h-8" />,
  COURSE_CHAMPION: <Trophy className="w-8 h-8" />,
  TOP_1_PERCENT: <Crown className="w-8 h-8" />,
  HELPFUL_PEER: <Medal className="w-8 h-8" />,
  OVERACHIEVER: <Award className="w-8 h-8" />,
};

const STYLE_BY_KEY: Record<string, { color: string; bg: string }> = {
  FIRST_STEPS: { color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-200" },
  ON_FIRE: { color: "text-orange-500", bg: "bg-orange-50 border-orange-200" },
  SHARPSHOOTER: { color: "text-red-500", bg: "bg-red-50 border-red-200" },
  COURSE_CHAMPION: { color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
};

interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  earned: boolean;
  earnedAt: string | null;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string | null;
  points: number;
  rank: number;
}

export default function StudentAchievementsPage() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/achievements").then((res) => res.json()),
      fetch("/api/leaderboard").then((res) => res.json()),
    ])
      .then(([achievementsBody, leaderboardBody]) => {
        if (achievementsBody.success) setAchievements(achievementsBody.data);
        if (leaderboardBody.success) setLeaderboard(leaderboardBody.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const earnedCount = achievements.filter((a) => a.earned).length;
  const currentUserEntry = leaderboard.find((u) => u.id === session?.user?.id);
  const nextMilestone = achievements.find((a) => !a.earned);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading achievements...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Gamification</h1>
        <p className="text-muted-foreground mt-1">Track your progress, earn badges, and compete with peers.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200 shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Medal className="w-5 h-5 mr-2 text-[#FFBB0A]" /> Badge Shelf
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">Unlock badges by completing milestones.</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-500 uppercase">Earned</p>
                  <p className="text-2xl font-extrabold text-[#0F2942]">{earnedCount} <span className="text-lg text-gray-400">/ {achievements.length}</span></p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {achievements.map((badge) => {
                  const style = STYLE_BY_KEY[badge.key] ?? { color: "text-gray-400", bg: "bg-gray-50 border-gray-200" };
                  return (
                    <div key={badge.id} className="relative group cursor-help">
                      <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${badge.earned ? style.bg + " hover:shadow-md hover:-translate-y-1" : "bg-gray-50 border-dashed border-gray-200 opacity-60 grayscale hover:grayscale-0"}`}>
                        <div className={`mb-3 ${badge.earned ? style.color : "text-gray-400"}`}>
                          {ICON_BY_KEY[badge.key] ?? <Award className="w-8 h-8" />}
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm text-center line-clamp-1">{badge.name}</h4>
                      </div>

                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white p-3 rounded-xl shadow-xl text-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                        <p className="font-bold text-sm mb-1">{badge.name}</p>
                        <p className="text-xs text-gray-300">{badge.description}</p>
                        {badge.earned ? (
                          <p className="text-[10px] text-yellow-400 font-bold mt-2 uppercase">Earned on {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : ""}</p>
                        ) : (
                          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Locked</p>
                        )}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {nextMilestone && (
            <Card className="border-gray-200 shadow-sm rounded-3xl bg-gradient-to-r from-[#0F2942] to-gray-800 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full pointer-events-none" />
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <p className="text-[#FFBB0A] text-sm font-bold uppercase tracking-wider mb-2">Next Milestone</p>
                  <h3 className="text-2xl font-extrabold tracking-tight mb-2">{nextMilestone.name}</h3>
                  <p className="text-gray-400 font-medium text-sm">{nextMilestone.description}</p>
                </div>
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center shrink-0 border-2 border-dashed border-white/20">
                  {ICON_BY_KEY[nextMilestone.key] ?? <Award className="w-8 h-8 text-gray-400" />}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="border-gray-200 shadow-sm rounded-3xl bg-white h-full flex flex-col">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-xl font-bold flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> Leaderboard
              </CardTitle>
              <CardDescription className="font-medium">Top 20 students.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
              <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
                <div className="text-sm font-bold text-blue-900">Your current rank</div>
                <div className="text-xl font-extrabold text-blue-700">{currentUserEntry ? `#${currentUserEntry.rank}` : "Unranked"}</div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px]">
                {leaderboard.length === 0 ? (
                  <p className="p-4 text-sm text-gray-400">No leaderboard activity yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {leaderboard.map((user) => {
                      const isCurrentUser = user.id === session?.user?.id;
                      return (
                        <li key={user.id} className={`flex items-center justify-between p-4 transition-colors ${isCurrentUser ? "bg-blue-50/30" : "hover:bg-gray-50/50"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-6 text-center font-bold text-sm ${user.rank === 1 ? "text-yellow-500 text-lg" : user.rank === 2 ? "text-gray-400" : user.rank === 3 ? "text-amber-700" : "text-gray-500"}`}>
                              {user.rank}
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${isCurrentUser ? "bg-[#0F2942] text-white" : "bg-gray-100 text-gray-700"}`}>
                              {user.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className={`font-bold text-sm ${isCurrentUser ? "text-[#0F2942]" : "text-gray-900"}`}>
                              {isCurrentUser ? "You" : user.name}
                            </div>
                          </div>
                          <div className="font-extrabold text-[#FFBB0A] text-sm">
                            {user.points.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold ml-0.5">PTS</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
